'use server';

import { redirect } from 'next/navigation';

export async function createReport(formData) {
  const rawFormData = Object.fromEntries(formData.entries());

  const params = new URLSearchParams();
  for (const key in rawFormData) {
    params.append(key, rawFormData[key]);
  }

  redirect(`/report?${params.toString()}`);
}
