// controllers/storageListener.ts

export function listenToStorageChanges(callback: () => void) {
    const originalSetItem = localStorage.setItem;
  
    localStorage.setItem = function (key, value) {
      const event = new CustomEvent("localStorageModified", {
        detail: { key, value },
      });
      originalSetItem.apply(this, [key, value]);
      window.dispatchEvent(event);
    };
  
    window.addEventListener("localStorageModified", () => {
      callback();
    });
  
    window.addEventListener("storage", (event) => {
      if (event.storageArea === localStorage) {
        callback();
      }
    });
  }
  