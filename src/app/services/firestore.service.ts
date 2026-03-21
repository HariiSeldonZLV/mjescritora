// app/services/firestore.service.ts
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  updateDoc
} from 'firebase/firestore';
import { getApp } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private platformId = inject(PLATFORM_ID);
  private db: any = null;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const app = getApp();
        this.db = getFirestore(app);
      } catch (error) {
        console.error('Error inicializando Firestore:', error);
      }
    }
  }

  /**
   * Obtener todos los documentos de una colección
   */
  async getCollection(collectionName: string, orderByField?: string, orderDirection: 'asc' | 'desc' = 'desc'): Promise<any[]> {
    if (!this.db) {
      console.warn('Firestore no disponible');
      return [];
    }

    try {
      const collectionRef = collection(this.db, collectionName);
      let q: any = collectionRef;

      if (orderByField) {
        q = query(collectionRef, orderBy(orderByField, orderDirection));
      }

      const querySnapshot = await getDocs(q);
      const results: any[] = [];

      querySnapshot.forEach((doc: any) => {
        results.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return results;
    } catch (error) {
      console.error(`Error obteniendo colección ${collectionName}:`, error);
      return [];
    }
  }

  /**
   * Agregar un documento a una colección
   */
  async addDocument(collectionName: string, data: any): Promise<string | null> {
    if (!this.db) {
      console.warn('Firestore no disponible');
      return null;
    }

    try {
      const collectionRef = collection(this.db, collectionName);
      const docRef = await addDoc(collectionRef, data);
      return docRef.id;
    } catch (error) {
      console.error(`Error agregando documento a ${collectionName}:`, error);
      throw error;
    }
  }
async updateDocument(collectionName: string, docId: string, data: any): Promise<void> {
  if (!this.db) throw new Error('Firestore no disponible');

  try {
    const docRef = doc(this.db, collectionName, docId);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error(`Error actualizando documento ${collectionName}/${docId}:`, error);
    throw error;
  }
}
  /**
   * Eliminar un documento de una colección
   */
  async deleteDocument(collectionName: string, docId: string): Promise<void> {
    if (!this.db) {
      console.warn('Firestore no disponible');
      return;
    }

    try {
      const docRef = doc(this.db, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error eliminando documento ${collectionName}/${docId}:`, error);
      throw error;
    }
  }
}
