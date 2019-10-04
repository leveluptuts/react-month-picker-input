import Translator from './Translator';

export const valuesToMask = (month: number, year: number, translate?: Translator): string => {
  const t = translate || new Translator();
  const monthNum = month + 1;
  const monthVal = monthNum < 10 ? '0' + monthNum : monthNum;
  let shortYear = year.toString().slice(2);

  switch(t.dateFormat()) {
    case('YY/MM'):
      return shortYear + '/' + monthVal;
    case('MM/YY'):
      return monthVal + '/' + shortYear;
    case('YYYY/MM'):
      return year + '/' + monthVal;
    case('MM/YYYY'):
    default:
      return monthVal + '/' + year;
  }
};

export const valuesFromMask = (maskedValue: string, translate: Translator, minDate: number[], maxDate: number[]): [number, number] => {
  const t = translate;
  const [monthVal, yearVal] = (t.dateFormat()[0] == 'M') ? maskedValue.split('/') : maskedValue.split('/').reverse();
  const rawMonth = parseInt(monthVal);
  let monthNum = rawMonth > 12 ? 12 : (rawMonth == 0 ? 1 : rawMonth);
  const [minDateMonth, minDateYear] = minDate;
  const [maxDateMonth, maxDateYear] = maxDate;
  // TODO: make base dynamic
  const inputYear = yearVal.length > 2 ? parseInt(yearVal) :2000 + parseInt(yearVal);
  const year = inputYear > maxDateYear ? maxDateYear : (inputYear < minDateYear ? minDateYear : inputYear);
  if (year == maxDateYear) {
    monthNum = monthNum > maxDateMonth ? maxDateMonth : monthNum;
  } else if (year == minDateYear) {
    monthNum = monthNum < minDateMonth ? minDateMonth : monthNum;
  } else{
    monthNum = monthNum;
  }
  const month = monthNum-1;
  return [month, year];
};

export const validationOfDate = (minDate?: [number, number], maxDate?: [number, number]): any => {
  let minDateValid = [1, 1];
  let maxDateValid = [12, 9999];
  if (minDate && minDate.length==2) {
    const [minDateMonthVal, minDateYear] = minDate;
    if (typeof minDateMonthVal == 'number' && typeof minDateYear == 'number') {
      const minDateMonth = minDateMonthVal > 12 ? 12 : (minDateMonthVal == 0 ? 1 : minDateMonthVal);
      minDateValid = [minDateMonth, minDateYear]
    } else {
      console.warn(`Wrong type of date for minDate. Must be [number(month), number(year)]`);
    };
  } else if (minDate && minDate.length!=2){
    console.warn(`Wrong type of date for minDate. Must be [number(month), number(year)]`);
  };
  if (maxDate && maxDate.length==2) {
    const [maxDateMonthVal, maxDateYear] = maxDate;
    if (typeof maxDateMonthVal == 'number' && typeof maxDateYear == 'number') {
      const maxDateMonth = maxDateMonthVal > 12 ? 12 : (maxDateMonthVal == 0 ? 1 : maxDateMonthVal);
      maxDateValid = [maxDateMonth, maxDateYear]
    } else {
      console.warn(`Wrong type of date for maxDate. Must be [number(month), number(year)]`);
    };
  } else if (maxDate && maxDate.length!=2){
    console.warn(`Wrong type of date for maxDate. Must be [number(month), number(year)]`);
  };
  return [minDateValid, maxDateValid];
}
