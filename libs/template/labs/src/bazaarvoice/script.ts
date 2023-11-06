const scriptSrc =
  'https://os.apps-testing.aop.demo-spryker.com/bazaar-voice?ver=1674731317&storeReference=AOP_Demo_Testing-DE';
const scriptId = 'bv';
const waitForBVObject = (
  resolve: (value: any) => void,
  reject: (reason?: any) => void
) => {
  const startTime = Date.now();
  const timeout = 10000;

  if ((window as any).$BV) {
    resolve((window as any).$BV);
  } else if (Date.now() - startTime > timeout) {
    reject('Timed out waiting for $BV object to be available.');
  } else {
    setTimeout(() => waitForBVObject(resolve, reject), 100);
  }
};

export const loadBvScript = (): Promise<any> => {
  return new Promise(function (resolve, reject) {
    const scriptElement = document.getElementById(scriptId);

    if (scriptElement) {
      waitForBVObject(resolve, reject);
    } else {
      const script = document.createElement('script');
      script.src = scriptSrc;
      script.id = scriptId;

      script.onload = () => waitForBVObject(resolve, reject);

      document.head.appendChild(script);
    }
  });
};

// export const addScript = (): Promise<unknown> => {
//   return new Promise(function (resolve, reject) {
//     if (document.getElementById('bavaarvoice')) {
//       if ((window as any).$BV) {
//         // The 'bv' object is already available, so resolve the promise with the 'bv' object
//         resolve((window as any).$BV);
//       } else {
//         // The 'bv' object is not yet available, so wait for it to be available
//         const checkBVObject = setInterval(function() {
//           if ((window as any).$BV) {
//             // The 'bv' object is now available, so clear the interval and resolve the promise with the 'bv' object
//             clearInterval(checkBVObject);
//             resolve((window as any).$BV);
//           }
//         }, 100);
//       }
//     } else {
//       const script = document.createElement('script');
//       script.src = scriptSrc;
//       script.id = 'third-party-script';
//       document.head.appendChild(script);

//       script.onload = () => {
//         setTimeout(() => {
//           resolve();
//         }, 1000);
//       };

//       document.head.appendChild(script);
//     }
//   });
// };
