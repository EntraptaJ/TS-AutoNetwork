// src/bin/objectLab.ts
const helloWorld = { test1: 'invalidTest1' };
const helloWorld2 = { test2: 'invalidTest2' };

enum CurrentObject {
  HELLOWORLD,
  HELLOWORLD2,
}

function getObject(currentObject: CurrentObject): { [key: string]: string } {
  switch (currentObject) {
    case CurrentObject.HELLOWORLD:
      return helloWorld;
    case CurrentObject.HELLOWORLD2:
      return helloWorld2;
  }
}

const currentValue = getObject(CurrentObject.HELLOWORLD2);

console.log('Creating errors', Object.values(currentValue)[0]);
