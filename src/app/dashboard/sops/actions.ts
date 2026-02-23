'use server';

import { revalidatePath } from 'next/cache';
import { createSop } from '@/lib/sops';

export type SopFormState = {
  error?: string;
  success?: string;
};

export async function createSopAction(
  _prevState: SopFormState,
  formData: FormData
): Promise<SopFormState> {
  const title = String(formData.get('title') || '').trim();
  const summary = String(formData.get('summary') || '').trim();
  const stepsRaw = String(formData.get('steps') || '')
    .split('\n')
    .map((step) => step.trim())
    .filter(Boolean);

  if (!title) {
    return { error: 'Please add a title for the SOP.' };
  }
  if (stepsRaw.length === 0) {
    return { error: 'Add at least one step to your SOP.' };
  }

  try {
    await createSop({ title, summary, steps: stepsRaw });
    revalidatePath('/dashboard/sops');
    return { success: 'SOP created.' };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to create SOP.' };
  }
}
