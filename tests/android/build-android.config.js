import { readEnv } from "@neurospeech/jex/dist/index.js";
import { resolve } from "path";

export default [
    {
        id: "com.domainname.name",
        name: "Application Name",

        url: "https://....",

        targetFramework: "net10.0-android",

        androidSdkRoot: readEnv("ANDROID_SDK_ROOT"),
        javaHome: readEnv("JAVA_HOME_21_X64", readEnv("JAVA_HOME")),

        androidKeyStore: resolve("./cert/android.keystore"),
        androidSigningKeyAlias: "android",

        androidKeyStorePassword: "abcd123",
        serviceAccountJsonRaw: readEnv("PLAYSTORE_SERVICE_ACCOUNT_JSON_TEXT", ""),
        serviceAccountJson: readEnv("PLAYSTORE_SERVICE_ACCOUNT_JSON_FILE", ""),

        /**
         * could be timestamp or patch.
         * timestamp will use current DATE and TIME in Seconds.
         * patch will parse number from package.json's version
         */
        buildNumber: "patch"
    },
]