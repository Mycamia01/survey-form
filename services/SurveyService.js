import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

const surveysCollection = collection(db, "surveys");

const SurveyService = {
  getAllSurveys: async (user) => {
    // user: { uid, role }
    if (!user || !user.role) {
      return [];
    }
    let q;
    if (user.role === "admin") {
      q = query(surveysCollection);
    } else if (user.role === "system_user") {
      q = query(surveysCollection, where("createdBy", "==", user.uid));
    } else {
      // no access
      return [];
    }
    const querySnapshot = await getDocs(q);
    const surveys = [];
    querySnapshot.forEach((doc) => {
      surveys.push({ id: doc.id, ...doc.data() });
    });
    return surveys;
  },

  createSurvey: async (user, surveyData) => {
    // Ensure createdBy is set to user.uid
    const dataWithUser = { ...surveyData, createdBy: user.uid };
    const docRef = await addDoc(surveysCollection, dataWithUser);
    return docRef.id;
  },

  updateSurvey: async (user, id, updatedData) => {
    const docRef = doc(db, "surveys", id);
    // Check permissions: admin can update any, system_user only own
    if (user.role === "admin") {
      await updateDoc(docRef, updatedData);
    } else if (user.role === "system_user") {
      // Fetch survey to check ownership
      const surveySnap = await getDoc(docRef);
      if (surveySnap.exists() && surveySnap.data().createdBy === user.uid) {
        await updateDoc(docRef, updatedData);
      } else {
        throw new Error("Unauthorized to update this survey");
      }
    } else {
      throw new Error("Unauthorized role");
    }
  },

  deleteSurvey: async (user, id) => {
    const docRef = doc(db, "surveys", id);
    if (user.role === "admin") {
      await deleteDoc(docRef);
    } else if (user.role === "system_user") {
      const surveySnap = await getDoc(docRef);
      if (surveySnap.exists() && surveySnap.data().createdBy === user.uid) {
        await deleteDoc(docRef);
      } else {
        throw new Error("Unauthorized to delete this survey");
      }
    } else {
      throw new Error("Unauthorized role");
    }
  },

  bulkUpdateStatus: async (user, ids, isActive) => {
    if (user.role !== "admin") {
      throw new Error("Unauthorized role");
    }
    const promises = ids.map((id) => {
      const docRef = doc(db, "surveys", id);
      return updateDoc(docRef, { isActive });
    });
    await Promise.all(promises);
  },

  bulkDelete: async (user, ids) => {
    if (user.role !== "admin") {
      throw new Error("Unauthorized role");
    }
    const promises = ids.map((id) => {
      const docRef = doc(db, "surveys", id);
      return deleteDoc(docRef);
    });
    await Promise.all(promises);
  },
};

export default SurveyService;
