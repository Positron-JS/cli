import XNode from "@neurospeech/jex/dist/core/XNode.js";
import { invoke, Batch, Run, mask } from "@neurospeech/jex/index.js";
import { FileSystem } from "@neurospeech/jex/dist/utils/FileSystem.js";
import { PlayStore } from "@neurospeech/jex/dist/ci/android/PlayStore.js";
import { Build } from "@neurospeech/jex/dist/ci/build/Build.js";
import assert from "assert";
import { Common } from "./common.js";
import configs from "../build-android.config.js";
let applicationDisplayVersion;
let applicationVersion;
for (const config of configs) {
  if (!config) {
    continue;
  }
  await invoke(XNode.create(Batch, null, () => "\n\n        ", () => "\n\n        ", () => XNode.create(Build.PrepareVersion, {
    mode: config.buildNumber,
    then: x => (applicationDisplayVersion = `${x.major}.${x.minor}`, applicationVersion = x.build),
    location: "D:\\git\\github\\positron\\cli\\content\\build-android.jsx 27,8"
  }), () => "\n\n        ", () => XNode.create(Common.PreBuild, {
    positronAppDir: positronAppDir,
    location: "D:\\git\\github\\positron\\cli\\content\\build-android.jsx 32,8"
  }), () => "\n\n        ", () => XNode.create(FileSystem.MergeJson, {
    json: {
      App: {
        Url: config.url
      }
    },
    path: "./maui/PositronApp/appsettings.json",
    location: "D:\\git\\github\\positron\\cli\\content\\build-android.jsx 34,8"
  }), () => "\n\n        ", () => (assert(applicationDisplayVersion), null), () => "\n        ", () => (assert(applicationVersion), null), () => "\n\n        ", () => XNode.create(Run, {
    cmd: "dotnet",
    timeout: 300000,
    args: "workload install maui",
    location: "D:\\git\\github\\positron\\cli\\content\\build-android.jsx 46,8"
  }), () => "\n\n        ", () => XNode.create(Run, {
    cmd: "dotnet",
    timeout: 300000,
    args: "workload install android",
    location: "D:\\git\\github\\positron\\cli\\content\\build-android.jsx 52,8"
  }), () => "\n\n        \n        ", () => XNode.create(Run, {
    cmd: "dotnet",
    timeout: 240000,
    logData: true,
    args: ["publish", "-f", config.targetFramework, "-c", "Release", `/p:ApplicationId=${config.id}`, `/p:ApplicationTitle=${config.name}`, `/p:ApplicationVersion=${applicationVersion}`, `/p:ApplicationDisplayVersion=${applicationDisplayVersion}`, "/p:AndroidKeyStore=true", `/p:AndroidSigningKeyAlias=${config.androidSigningKeyAlias}`, `/p:AndroidSigningKeyStore=${config.androidKeyStore}`, mask`/p:AndroidSigningStorePass=${config.androidKeyStorePassword}`, mask`/p:AndroidSigningKeyPass=${config.androidKeyStorePassword}`, config.androidSdkRoot ? `/p:AndroidSdkPath=${config.androidSdkRoot}` : void 0, config.javaHome ? `/p:JavaSdkDirectory=${config.javaHome}` : void 0, "./maui/PositronApp/PositronApp.csproj"],
    location: "D:\\git\\github\\positron\\cli\\content\\build-android.jsx 59,8"
  }), () => "\n\n        ", () => XNode.create(PlayStore.Upload, {
    packageName: config.id,
    releaseFiles: [`./maui/PositronApp/bin/Release/${config.targetFramework}/publish/*-Signed.apk`],
    serviceAccountJsonRaw: config.serviceAccountJsonRaw,
    serviceAccountJson: config.serviceAccountJson,
    location: "D:\\git\\github\\positron\\cli\\content\\build-android.jsx 80,8"
  }), () => "\n\n    "));
}