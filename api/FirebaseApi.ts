import { firebase } from '../firebase';
import { Todo } from '../typescript/interfaces';

export const addNewLocation = (todo: Todo) => {
  const db = firebase.firestore();
  const docRef = db.collection('todos').doc();
  docRef
    .set({
      description: todo.description,
      locationID: todo.location ?? null,
    })
    .then(() => {
      console.log('successfully added todo', todo);
    })
    .catch((err) => console.log(err));
};

export const updateLocation = (todo: Todo, id: string) => {
  const db = firebase.firestore();
  console.log('id', id, todo);
  const docRef = db.collection('todos').doc(id);
  docRef
    .update({
      description: todo.description,
      locationID: todo.location,
    })
    .then(() => {
      console.log('successfully updated todo', todo);
    })
    .catch((err) => console.log(err));
};

export const deleteLocation = (id: string) => {
  const db = firebase.firestore();
  const docRef = db.collection('todos').doc(id);
  docRef
    .delete()
    .then(() => {
      console.log('Document successfully deleted!');
    })
    .catch((error) => {
      console.error('Error removing document: ', error);
    });
};

export const getLocations = async () => {
  let locations = [];
  const db = firebase.firestore();
  return db
    .collection('locations')
    .get()
    .then((locationSnapshot) => {
      locationSnapshot.forEach((doc) => {
        locations.push({ ...doc.data(), id: doc.id });
      });
      return locations;
    });
};

export const getTodos = async () => {
  let todos = [];
  const db = firebase.firestore();
  return db
    .collection('todos')
    .get()
    .then((todoSnapshot) => {
      todoSnapshot.forEach((doc) => {
        todos.push({ ...doc.data(), id: doc.id });
      });
      return todos;
    });
};
