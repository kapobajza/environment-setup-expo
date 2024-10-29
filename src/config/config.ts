import { z } from 'zod';
import appEnv from './env';

type ExcludeExpoPublicPrefix<TKey extends string> = TKey extends `EXPO_PUBLIC_${infer T}` ? T : TKey;

export type ExpoAppEnv = typeof appEnv;

const appConfigSchema = z.object({
  APP_NAME: z.string(),
  ENV: z.string(),
} satisfies Record<ExcludeExpoPublicPrefix<keyof ExpoAppEnv>, z.ZodTypeAny>);

export type AppConfig = z.infer<typeof appConfigSchema>;

export const config = {
  APP_NAME: appEnv.EXPO_PUBLIC_APP_NAME,
  ENV: appEnv.EXPO_PUBLIC_ENV,
} satisfies AppConfig;

appConfigSchema.parse(config);
