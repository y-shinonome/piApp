import { initializeApp, applicationDefault } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

type Measurement = {
  datetime: Date,
  temperature: number,
  humidity: number
}

initializeApp({
  credential: applicationDefault(),
})

export const addDoc = async (measurement:Measurement) => {
  const db = getFirestore()
  const docRef = db.collection('thermohygrometer').doc() 
  await docRef.set(measurement)
}