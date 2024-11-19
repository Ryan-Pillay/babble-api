// app/api/agora/webhook/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

export async function POST(req) {
  try {
    const event = await req.json();
    console.log('Webhook event received:', event);

    const eventType = event?.payload?.action;
    const applicantId = event?.payload?.resource?.applicant_id;

    if (!applicantId) {
      return NextResponse.json(
        { message: 'Invalid payload: Missing applicant_id' },
        { status: 400 }
      );
    }

    if (eventType === 'workflow_run.completed') {
      const workflowStatus = event?.payload?.resource?.status;

      // Query Firestore for the user
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('onfido_applicant_id', '==', applicantId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return NextResponse.json(
          { message: `No user found for onfido_applicant_id: ${applicantId}` },
          { status: 404 }
        );
      }

      // Update user documents based on workflow status
      const updates = [];
      let verified = false;

      querySnapshot.forEach((doc) => {
        const userRef = doc.ref;

        if (workflowStatus === 'approved') {
          verified = true; // Mark user as verified
          updates.push(
            updateDoc(userRef, {
              onfido_status: 'approved',
              verified: true
            })
          );
        } else {
          updates.push(
            updateDoc(userRef, {
              onfido_status: workflowStatus // e.g., "rejected", "abandoned"
            })
          );
        }
      });

      await Promise.all(updates);

      console.log(
        `User verification updated for onfido_applicant_id: ${applicantId}, verified: ${verified}`
      );
      return NextResponse.json({ message: `onfido_status and verified updated` });
    }

    // Handle other event types...
    return NextResponse.json({ message: 'Event ignored' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
