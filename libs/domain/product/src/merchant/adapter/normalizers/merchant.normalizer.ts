import {
  Merchant,
  MerchantSchedule,
  MerchantScheduleSlot,
} from '../../merchant.model';
import { ApiMerchantModel } from '../../merchant.model.api';

function normalizeOpeningHours(
  hours: ApiMerchantModel.MerchantOpeningHours
): MerchantSchedule {
  console.log(hours);

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

export function merchantNormalizer(data: ApiMerchantModel.Merchant): Merchant {
  console.log(data);
  return {
    id: data.id,
    name: data.merchantName,
    description: data.description,
    url: data.merchantUrl,
    deliveryTime: data.deliveryTime,
    legal: data.legalInformation,
    schedule: normalizeOpeningHours(data.merchantOpeningHours?.[0]),
    logo: data.logoUrl,
    banner: data.bannerUrl,
    contact: {
      email: data.publicEmail,
      phone: data.publicPhone,
    },
  } as Merchant;
}
