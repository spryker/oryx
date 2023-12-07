import {
  ApiMerchantModel,
  Merchant,
  MerchantLegal,
  MerchantSchedule,
  MerchantScheduleSlot,
} from '../../../models';

function normalizeOpeningHours(
  hours: ApiMerchantModel.MerchantOpeningHours
): MerchantSchedule | undefined {
  if (!hours) return undefined;

  const uniqueDays: MerchantScheduleSlot[] = [];
  for (const entry of hours.weekdaySchedule) {
    let dayEntry = uniqueDays.find(
      (day) => day.day === entry.day?.toLowerCase()
    );
    if (!dayEntry) {
      dayEntry = { day: entry.day?.toLowerCase() };
      uniqueDays.push(dayEntry);
    }
    if (entry.timeFrom && entry.timeTo) {
      if (!dayEntry.times) dayEntry.times = [];
      dayEntry.times.push({ from: entry.timeFrom, to: entry.timeTo });
    }
  }

  return {
    opened: uniqueDays,
    closed: [],
  };
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
    schedule: normalizeOpeningHours(data.merchantOpeningHours?.[0]),
    logo: data.logoUrl,
    banner: data.bannerUrl,
    contact: {
      email: data.publicEmail,
      phone: data.publicPhone,
    },
  } as Merchant;
}
