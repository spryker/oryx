import {
  ApiMerchantModel,
  Merchant,
  MerchantDateSlot,
  MerchantLegal,
  MerchantSchedule,
  MerchantWeekdaySlot,
} from '../../../models';

function normalizeSchedule(
  hours: ApiMerchantModel.Schedule
): MerchantSchedule | undefined {
  if (!hours) return undefined;

  const weekdays: MerchantWeekdaySlot[] = [];
  for (const entry of hours.weekdaySchedule) {
    let dayEntry = weekdays.find((day) => day.day === entry.day?.toLowerCase());
    if (!dayEntry) {
      dayEntry = { day: entry.day.toLowerCase() };
      weekdays.push(dayEntry);
    }
    if (entry.timeFrom && entry.timeTo) {
      if (!dayEntry.times) dayEntry.times = [];
      dayEntry.times.push({ from: entry.timeFrom, to: entry.timeTo });
    }
  }

  const dates: MerchantDateSlot[] = [];
  for (const entry of hours.dateSchedule) {
    let dateEntry = dates.find((date) => date.date === entry.date);
    if (!dateEntry) {
      dateEntry = { date: entry.date, note: entry.noteGlossaryKey };
      dates.push(dateEntry);
    }
    if (entry.timeFrom && entry.timeTo) {
      if (!dateEntry.times) dateEntry.times = [];
      dateEntry.times.push({ from: entry.timeFrom, to: entry.timeTo });
    }
  }

  console.log({ weekdays, dates });
  return { weekdays, dates };
}

function normalizeLegal(
  data: ApiMerchantModel.MerchantLegal
): MerchantLegal | undefined {
  if (!data) return undefined;

  return {
    dataPrivacy: data.dataPrivacy,
    cancellationPolicy: data.cancellationPolicy,
    terms: data.terms?.replace('<br><br>', '<br />'),
    imprint: data.imprint,
  };
}

export function merchantNormalizer(
  data: ApiMerchantModel.Merchant
): Merchant | undefined {
  if (!data) return;

  return {
    id: data.id,
    name: data.merchantName,
    description: data.description,
    url: data.merchantUrl,
    deliveryTime: data.deliveryTime,
    legal: normalizeLegal(data.legalInformation),
    schedule: normalizeSchedule(data.merchantOpeningHours?.[0]),
    logo: data.logoUrl,
    banner: data.bannerUrl,
    contact: {
      email: data.publicEmail,
      phone: data.publicPhone,
    },
  } as Merchant;
}
