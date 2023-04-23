import app from "./appManager";
import { installApp } from "./appManager";
import { loading } from "./global";
import { requestAppList } from "./store";

import * as vue from "vue";
(window as any).vue = vue;


import Unit from "./TestUse/Unit.vue";
app.component("Unit", Unit);



(async function () {
  // 安装其他应用(异步)
  app.mount("#app");
  loading.value = true;
  for (let i = 0; i < requestAppList.length; ++i) {
    await installApp(requestAppList[i]);
  }
  loading.value = false;
})();
