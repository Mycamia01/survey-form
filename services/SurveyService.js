import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

const surveysCollection = collection(db, "surveys");

const SurveyService = {
  getAllSurveys: async () => {
    const querySnapshot = await getDocs(surveysCollection);
    const surveys = [];
    querySnapshot.forEach((doc) => {
      surveys.push({ id: doc.id, ...doc.data() });
    });
    return surveys;
  },

  createSurvey: async (surveyData) => {
    const docRef = await addDoc(surveysCollection, surveyData);
    return docRef.id;
  },

  updateSurvey: async (id, updatedData) => {
    const docRef = doc(db, "surveys", id);
    await updateDoc(docRef, updatedData);
  },

  deleteSurvey: async (id) => {
    const docRef = doc(db, "surveys", id);
    await deleteDoc(docRef);
  },

  bulkUpdateStatus: async (ids, isActive) => {
    const promises = ids.map((id) => {
      const docRef = doc(db, "surveys", id);
      return updateDoc(docRef, { isActive });
    });
    await Promise.all(promises);
  },

  bulkDelete: async (ids) => {
    const promises = ids.map((id) => {
      const docRef = doc(db, "surveys", id);
      return deleteDoc(docRef);
    });
    await Promise.all(promises);
  },
};

export default SurveyService;
