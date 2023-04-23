import type { Component } from "vue";
import { reactive } from "vue";

import { createApp } from "vue";
import App from "./App.vue";
const app = createApp(App);
export default app;

interface Application {
  register_name?: string;
  appliaction_name: string;
  icon?: string;
  singleton: boolean;
  component: Component;
}

interface SysApplication {
  register_name: string;
  singleton: boolean;
  component: Component;
}

interface RegisteredComponent {
  singleton: boolean;
  count: number;
  component: Component;
  icon: Application["icon"];
  application_name?: Application["appliaction_name"];
}

export const registeredComponents: {
  [index: string]: RegisteredComponent;
} = {};

// 安装系统应用，系统应用只注册组件，不写入安装列表
function installSysApp(sys_application: SysApplication): boolean {
  if (registeredComponents[sys_application.register_name]) return false;
  else {
    const registerName = "sys-" + sys_application.register_name;
    const registeredComponent: RegisteredComponent = {
      singleton: sys_application.singleton,
      count: 0,
      component: sys_application.component,
      icon: "",
    };
    registeredComponents[registerName] = registeredComponent;
    app.component(registerName, sys_application.component);
    return true;
  }
}
import Setup from "@/sys-application/Setup";
installSysApp({
  register_name: "setup",
  singleton: true,
  component: Setup,
});
import Error from "@/sys-application/Error.vue";
installSysApp({
  register_name: "error",
  singleton: true,
  component: Error,
});

// 其他远程应用
interface installedApplication {
  icon: Application["icon"];
  application_name: Application["appliaction_name"];
  register_name: Application["register_name"];
  url: string;
}

export const installedList: installedApplication[] = reactive([]);
// 卸载后组件依旧注册，直到刷新（由于Vue组件无法取消注册）
import axios from "axios";
export async function installApp(url: string): Promise<boolean> {
  let application = new Function((await axios.get(url)).data)() as Application;
  if (application.register_name === undefined) application.register_name = url;
  if (registeredComponents[application.register_name]) return false;
  else {
    const registeredComponent: RegisteredComponent = {
      singleton: application.singleton,
      count: 0,
      component: application.component,
      icon: application.icon ? application.icon : "",
      application_name: application.appliaction_name,
    };
    registeredComponents[application.register_name] = registeredComponent;
    installedList.push({
      icon: application.icon,
      application_name: application.appliaction_name,
      register_name: application.register_name
        ? application.register_name
        : url,
      url,
    });
    app.component(application.register_name, application.component);
    return true;
  }
}

export function uninsatllApp(url: string) {
  const index = installedList.findIndex((i) => {
    i.url === url;
  });
  installedList.splice(index, 1);
}
