// app/api/agora/webhook/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, increment } from 'firebase/firestore';

export async function POST(request) {
  try {
    // Extract the body of the request
    const { noticeId, productId, eventType, payload } = await request.json();
    
    // Extract specific details from payload
    const { channelName, uid } = payload;

    // Quick bypass for test data
    if (channelName === "test_webhook") {
      console.log("Test data detected, returning success.");
      return new NextResponse(
        JSON.stringify({ success: true, message: "Test passed with 200 OK" }),
        { status: 200 }
      );
    }

    // Normal processing if not test data
    if (!noticeId || !productId || !eventType || !payload) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400 }
      );
    }

    if (eventType === 103 || eventType === 104) {
      const usersRef = collection(db, 'users');
      const userQuery = query(usersRef, where('babble_username', '==', channelName));
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        return new NextResponse(
          JSON.stringify({ error: 'User not found' }),
          { status: 404 }
        );
      }

      const userDoc = querySnapshot.docs[0];
      const userRef = userDoc.ref;
      const totalUsersInQueue = userDoc.data().total_users_in_queue || 0;

      if (eventType === 103) {
        await updateDoc(userRef, { total_users_in_queue: Math.min(totalUsersInQueue + 1, 2) });
      } else if (eventType === 104) {
        const newQueueCount = Math.max(totalUsersInQueue - 1, 0);
        await updateDoc(userRef, { total_users_in_queue: newQueueCount });
        if (newQueueCount === 0) {
          await updateDoc(userRef, { has_open_queue: false });
        }
      }
    }

    return new NextResponse(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}
