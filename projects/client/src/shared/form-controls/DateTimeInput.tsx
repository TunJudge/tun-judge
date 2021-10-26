import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ExclamationCircleIcon,
  XIcon,
} from '@heroicons/react/outline';
import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getDisplayDate, useLongPress } from '@core/helpers';

import { BasicInputProps } from './BasicInput';
import Label from './Label';
import { EntityFieldInputProps } from './types';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const months: { [id: number]: string } = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
};

const yearMonths: {
  [id: number]: {
    name: string;
    shortName: string;
    monthNumber: number;
  };
} = {
  0: { name: 'January', shortName: 'Jan', monthNumber: 1 },
  1: { name: 'February', shortName: 'Feb', monthNumber: 2 },
  2: { name: 'March', shortName: 'Mar', monthNumber: 3 },
  3: { name: 'April', shortName: 'Apr', monthNumber: 4 },
  4: { name: 'May', shortName: 'May', monthNumber: 5 },
  5: { name: 'June', shortName: 'Jun', monthNumber: 6 },
  6: { name: 'July', shortName: 'Jul', monthNumber: 7 },
  7: { name: 'August', shortName: 'Aug', monthNumber: 8 },
  8: { name: 'September', shortName: 'Sep', monthNumber: 9 },
  9: { name: 'October', shortName: 'Oct', monthNumber: 10 },
  10: { name: 'November', shortName: 'Nov', monthNumber: 11 },
  11: { name: 'December', shortName: 'Dec', monthNumber: 12 },
};

const weekDays: {
  [id: number]: {
    name: string;
    shortName: string;
    weekdayNumber: number;
  };
} = {
  0: {
    name: 'Sunday',
    shortName: 'Sun',
    weekdayNumber: 0,
  },
  1: {
    name: 'Monday',
    shortName: 'Mon',
    weekdayNumber: 1,
  },
  2: {
    name: 'Tuesday',
    shortName: 'Tue',
    weekdayNumber: 2,
  },
  3: {
    name: 'Wednesday',
    shortName: 'Wed',
    weekdayNumber: 3,
  },
  4: {
    name: 'Thursday',
    shortName: 'Thu',
    weekdayNumber: 4,
  },
  5: {
    name: 'Friday',
    shortName: 'Fri',
    weekdayNumber: 5,
  },
  6: {
    name: 'Saturday',
    shortName: 'Sat',
    weekdayNumber: 6,
  },
};

function isEqualDate(date1: Date, date2: Date, type: 'time' | 'day' = 'time') {
  return type === 'time'
    ? date1.getTime() === date2.getTime()
    : date1.toDateString() === date2.toDateString();
}

function isGreaterThanDate(date1: Date, date2: Date, type: 'time' | 'day' = 'time') {
  if (type === 'day') {
    const auxDate1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const auxDate2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

    return auxDate1.getTime() > auxDate2.getTime();
  }

  return date1.getTime() > date2.getTime();
}

function isLessThanDate(date1: Date, date2: Date, type: 'time' | 'day' = 'time') {
  if (type === 'day') {
    const auxDate1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const auxDate2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

    return auxDate1.getTime() < auxDate2.getTime();
  }

  return date1.getTime() < date2.getTime();
}

type Props<T> = EntityFieldInputProps<T, Date> & {
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  clearable?: boolean;
} & BasicInputProps;

function DateTimeInput<T>({
  entity,
  field,
  label,
  description,
  placeHolder,
  width = 'none',
  required,
  clearable,
  minDate,
  maxDate,
  disabled,
  defaultTouched,
  errors,
  setErrors,
  onChange,
}: Props<T>): JSX.Element {
  const today = new Date();

  const [isOpen, setIsOpen] = useState<boolean>();
  const [date, setDate] = useState<Date>(today);
  const [month, setMonth] = useState<number>(today.getMonth());
  const [year, setYear] = useState<number>(today.getFullYear());
  const [daysInMonthArr, setDaysInMonthArr] = useState<number[]>([]);
  const [yearsRange, setYearsRange] = useState<number[]>([]);
  const [blankDaysArr, setBlankDaysArr] = useState<number[]>([]);
  const [calendarView, setCalendarView] = useState<'days' | 'months' | 'years'>('days');
  const [touched, setTouched] = useState(defaultTouched);

  const displayDate = useMemo(() => entity[field] && getDisplayDate(date), [date, entity, field]);
  const hasErrors = useMemo(
    () => touched && errors?.[field],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [touched, errors, field, errors?.[field]]
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const setInitValue = useCallback(() => {
    const today = entity[field] ? new Date(entity[field] as any) : new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    const dayOfWeek = new Date(year, month).getDay();
    const weekdayNumber = weekDays[dayOfWeek].weekdayNumber;
    const newDate = new Date(year, month, today.getDate(), today.getHours(), today.getMinutes());

    // Get last day number of the previous actual month
    const daysInMonth = new Date(year, month, 0).getDate();

    // Get the number (0-6) on which the actual month starts
    const blankDaysArr: number[] = [];
    for (let i = 1; i <= weekdayNumber; i++) {
      blankDaysArr.push(i);
    }

    const daysInMonthArr: number[] = [];
    for (let i = 1; i < daysInMonth; i++) {
      daysInMonthArr.push(i);
    }

    setDate(newDate);
    setMonth(month);
    setYear(year);
    setDaysInMonthArr(daysInMonthArr);
    setBlankDaysArr(blankDaysArr);
    refreshYearRange(year);
  }, [entity, field]);

  useEffect(() => {
    setInitValue();

    const onClickListener = (event: any) => {
      if (!event.path.includes(calendarRef.current) && !event.path.includes(inputRef.current)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickListener);

    return () => {
      document.removeEventListener('mousedown', onClickListener);
    };
  }, [setInitValue]);

  useEffect(() => {
    if (!isOpen) {
      setInitValue();
      setCalendarView('days');
    }
  }, [isOpen, setInitValue]);

  const refreshYearRange = (year: number) => {
    const yearsRangeArr: number[] = [];
    for (let i = year - 6; i < year + 6; i++) {
      yearsRangeArr.push(i);
    }
    setYearsRange(yearsRangeArr);
  };

  const editCalendarViewPage = (type: 'add' | 'subtract') => () => {
    let newYear: number = year;
    let newMonth: number = month;
    if (calendarView === 'days') {
      if (type === 'add') {
        if (month === 11) {
          newMonth = 0;
          newYear = year + 1;
        } else {
          newMonth = month + 1;
          newYear = year;
        }
      } else {
        if (month === 0) {
          newMonth = 11;
          newYear = year - 1;
        } else {
          newMonth = month - 1;
          newYear = year;
        }
      }
    } else if (calendarView === 'months') {
      newYear = year + (type === 'add' ? 1 : -1);
    } else {
      const yearsRangeArr: number[] = [];
      for (let i = 0; i < 12; i++) {
        yearsRangeArr.push(yearsRange[i] + (type === 'add' ? 12 : -12));
      }
      setYearsRange(yearsRangeArr);
    }

    const newMonthFirstWeekdayNumber = new Date(newYear, newMonth, 1).getDay();
    const firstWeekdayNumber = weekDays[newMonthFirstWeekdayNumber].weekdayNumber;
    const daysInMonth = new Date(newYear, newMonth + 1, 0).getDate();

    const blankDaysArr: number[] = [];
    for (let i = 1; i <= firstWeekdayNumber; i++) {
      blankDaysArr.push(i);
    }

    const daysInMonthArr: number[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      daysInMonthArr.push(i);
    }

    setYear(newYear);
    setMonth(newMonth);
    setDaysInMonthArr(daysInMonthArr);
    setBlankDaysArr(blankDaysArr);
  };

  const setDayNumber = (dayNumber: number) => () => {
    const newDate = new Date(year, month, dayNumber, date.getHours(), date.getMinutes());

    if (minDate) {
      const _minDate = new Date(minDate);
      if (
        _minDate.getFullYear() === year &&
        _minDate.getMonth() === month &&
        _minDate.getDate() === dayNumber
      ) {
        newDate.setHours(Math.max(newDate.getHours(), _minDate.getHours()));
        if (newDate.getHours() === _minDate.getHours()) {
          newDate.setMinutes(Math.max(newDate.getMinutes(), _minDate.getMinutes()));
        }
      }
    }

    if (maxDate) {
      const _maxDate = new Date(maxDate);
      if (
        _maxDate.getFullYear() === year &&
        _maxDate.getMonth() === month &&
        _maxDate.getDate() === dayNumber
      ) {
        newDate.setHours(Math.min(newDate.getHours(), _maxDate.getHours()));
        if (newDate.getHours() === _maxDate.getHours()) {
          newDate.setMinutes(Math.min(newDate.getMinutes(), _maxDate.getMinutes()));
        }
      }
    }

    setNewDate(newDate);
  };

  const editDateField = (field: 'hours' | 'minutes', diff: 1 | -1) => () => {
    const newDate = new Date(date);
    let number = 1;

    if (field === 'minutes') number = 60 * diff;
    if (field === 'hours') number = 60 * 60 * diff;

    number *= 1000;
    newDate.setTime(newDate.getTime() + number);

    if (minDate && isLessThanDate(newDate, new Date(minDate))) return;
    if (maxDate && isGreaterThanDate(newDate, new Date(maxDate))) return;

    setNewDate(newDate);
  };

  const setNewDate = (newDate: Date) => {
    setDate(newDate);

    entity[field] = newDate as any;
    setErrors?.({ ...errors, [field]: false });
    onChange?.(newDate);
  };

  const clearDate = () => {
    setDate(new Date());

    entity[field] = null as any;
    required && setErrors?.({ ...errors, [field]: true });
  };

  const nextCalendarView = () => {
    setMonth(date.getMonth());
    setYear(date.getFullYear());
    refreshYearRange(date.getFullYear());
    if (calendarView === 'days') {
      setCalendarView('months');
    } else if (calendarView === 'months') {
      setCalendarView('years');
    } else {
      setCalendarView('days');
    }
  };

  const setMonthView = (month: number) => () => {
    setMonth(month);
    setCalendarView('days');
  };

  const setYearView = (year: number) => () => {
    setYear(year);
    setCalendarView('months');
  };

  const increaseHours = useLongPress(editDateField('hours', 1));
  const decreaseHours = useLongPress(editDateField('hours', -1));
  const increaseMinutes = useLongPress(editDateField('minutes', 1));
  const decreaseMinutes = useLongPress(editDateField('minutes', -1));

  return (
    <div
      className={classNames('flex flex-col', {
        'opacity-50': disabled,
        'col-span-1': width === '1',
        'col-span-2': width === '2',
        'col-span-3': width === '3',
        'col-span-4': width === '4',
        'col-span-5': width === '5',
        'col-span-6': width === '6',
        'col-span-7': width === '7',
        'col-span-8': width === '8',
        'col-span-9': width === '9',
        'col-span-10': width === '10',
        'col-span-11': width === '11',
        'col-span-12': width === '12',
        'col-span-13': width === '13',
        'col-span-14': width === '14',
        'col-span-15': width === '15',
        'col-span-16': width === '16',
        'col-span-none': width === 'none',
      })}
    >
      <Label
        label={label}
        description={description}
        required={required}
        hasErrors={touched && hasErrors}
      />
      <div className={classNames('relative', { 'mt-1': !!label })}>
        <input
          type="text"
          readOnly
          ref={inputRef}
          disabled={disabled}
          value={displayDate ?? ''}
          onBlur={() => setTouched(true)}
          onClick={() => setIsOpen(!isOpen)}
          className={classNames(
            'w-full border border-gray-300 rounded-md shadow-sm dark:text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400',
            {
              'border-red-600 placeholder-red-900 opacity-70 dark:border-red-500 dark:placeholder-red-500':
                hasErrors,
            }
          )}
          placeholder={placeHolder ?? label ?? 'Select date'}
        />

        {hasErrors ? (
          <div className="absolute inset-y-0 right-0 flex items-center px-3">
            <ExclamationCircleIcon className="text-red-600 h-6 w-6" />
          </div>
        ) : (
          clearable &&
          displayDate && (
            <div
              className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer"
              onClick={clearDate}
            >
              <XIcon className="h-6 w-6 text-gray-500" />
            </div>
          )
        )}

        {isOpen && (
          <div className="relative z-10 dark:text-white">
            <div
              className="flex flex-col duration-200 mt-1 bg-white border rounded-md shadow absolute origin-top-left dark:bg-gray-800 dark:border-gray-700"
              ref={calendarRef}
            >
              <div className="select-none">
                <div className="flex pt-2 px-3">
                  <div
                    className="flex items-center transition ease-in-out duration-100 cursor-pointer rounded-full px-2 py-1 -ml-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={nextCalendarView}
                  >
                    {calendarView === 'years' && (
                      <ChevronLeftIcon className="h-5 w-5 text-gray-400" />
                    )}
                    {calendarView === 'days' && <span>{months[month]}</span>}
                    {calendarView !== 'years' ? (
                      <>
                        <span className="ml-1 text-gray-500 dark:text-gray-300">{year}</span>
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                      </>
                    ) : (
                      <span className="ml-1 text-gray-500 dark:text-gray-300">
                        {yearsRange[0]} - {yearsRange[11]}
                      </span>
                    )}
                  </div>
                  <div
                    className="transition ease-in-out duration-100 cursor-pointer rounded-full p-1 ml-auto hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={editCalendarViewPage('subtract')}
                  >
                    <ChevronLeftIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div
                    className="transition ease-in-out duration-100 cursor-pointer rounded-full p-1 -mr-1 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={editCalendarViewPage('add')}
                  >
                    <ChevronRightIcon className="h-6 w-6 text-gray-400" />
                  </div>
                </div>
                {calendarView === 'days' ? (
                  <div className="px-3 py-2">
                    <div className="grid grid-cols-7">
                      {days.map((day, index) => (
                        <span
                          key={index}
                          className="uppercase text-xs text-gray-500 dark:text-gray-400 w-8 h-8 flex items-center justify-center"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-7">
                      {blankDaysArr.map((day) => (
                        <div key={day} className="w-full h-8 flex items-center" />
                      ))}
                      {daysInMonthArr.map((dayNumber, index) => {
                        const dayDate = new Date(year, month, dayNumber);
                        const isDaySelectable =
                          (!minDate || !isLessThanDate(dayDate, new Date(minDate), 'day')) &&
                          (!maxDate || !isGreaterThanDate(dayDate, new Date(maxDate), 'day'));
                        const isEqualSelectedDate =
                          entity[field] &&
                          isEqualDate(dayDate, new Date(entity[field] as any), 'day');
                        const isEqualToday = isEqualDate(dayDate, new Date(), 'day');

                        return (
                          <div
                            key={index}
                            className={classNames(
                              'flex items-center justify-center text-sm rounded-full w-8 h-8 mx-auto',
                              {
                                'border border-blue-500': isEqualToday,
                                'bg-blue-500 text-white': isEqualSelectedDate,
                                'cursor-pointer': isDaySelectable,
                                'hover:bg-blue-100 dark:hover:bg-blue-900':
                                  isDaySelectable && !isEqualSelectedDate,
                                'text-gray-400 dark:text-gray-500': !isDaySelectable,
                              }
                            )}
                            onClick={isDaySelectable ? setDayNumber(dayNumber) : undefined}
                          >
                            {dayNumber}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : calendarView === 'months' ? (
                  <div className="px-3 py-2 grid grid-cols-4">
                    {Object.values(yearMonths).map(({ shortName }, index) => {
                      const today = new Date();
                      const isEqualThisMonth =
                        year === today.getFullYear() && index === today.getMonth();
                      const isEqualSelectedMonth =
                        entity[field] && year === date.getFullYear() && index === date.getMonth();
                      const monthDate = new Date(
                        year,
                        index,
                        date.getDate(),
                        date.getHours(),
                        date.getMinutes()
                      );
                      const isMonthSelectable =
                        (!minDate || !isLessThanDate(monthDate, new Date(minDate), 'day')) &&
                        (!maxDate || !isGreaterThanDate(monthDate, new Date(maxDate), 'day'));

                      return (
                        <div
                          key={index}
                          className={classNames(
                            'flex items-center justify-center w-14 py-3 text-sm rounded mx-auto border',
                            {
                              'border-blue-500': isEqualThisMonth,
                              'border-transparent': !isEqualThisMonth,
                              'bg-blue-500 text-white': isEqualSelectedMonth,
                              'cursor-pointer': isMonthSelectable,
                              'hover:bg-blue-100 dark:hover:bg-blue-900':
                                isMonthSelectable && !isEqualSelectedMonth,
                              'text-gray-400 dark:text-gray-500': !isMonthSelectable,
                            }
                          )}
                          onClick={setMonthView(index)}
                        >
                          {shortName}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-3 py-2 grid grid-cols-4">
                    {yearsRange.map((yearNumber) => {
                      const today = new Date();
                      const isEqualThisYear = yearNumber === today.getFullYear();
                      const isEqualSelectedYear =
                        entity[field] && yearNumber === date.getFullYear();
                      const yearDate = new Date(
                        yearNumber,
                        date.getMonth(),
                        date.getDate(),
                        date.getHours(),
                        date.getMinutes()
                      );
                      const isYearSelectable =
                        (!minDate || !isLessThanDate(yearDate, new Date(minDate), 'day')) &&
                        (!maxDate || !isGreaterThanDate(yearDate, new Date(maxDate), 'day'));

                      return (
                        <div
                          key={yearNumber}
                          className={classNames(
                            'flex items-center justify-center w-14 py-3 text-sm rounded mx-auto border',
                            {
                              'border-blue-500': isEqualThisYear,
                              'border-transparent': !isEqualThisYear,
                              'bg-blue-500 text-white': isEqualSelectedYear,
                              'cursor-pointer': isYearSelectable,
                              'hover:bg-blue-100 dark:hover:bg-blue-900':
                                isYearSelectable && !isEqualSelectedYear,
                              'text-gray-400 dark:text-gray-500': !isYearSelectable,
                            }
                          )}
                          onClick={setYearView(yearNumber)}
                        >
                          {yearNumber}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              {calendarView === 'days' && (
                <div className="flex items-center justify-between px-3 py-2 select-none">
                  <label className="text-sm text-gray-700 dark:text-gray-300">Time</label>
                  <div className="flex justify-center flex-grow gap-2">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <ChevronUpIcon
                        className="h-4 w-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={editDateField('hours', 1)}
                        {...increaseHours}
                      />
                      <ChevronDownIcon
                        className="h-4 w-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={editDateField('hours', -1)}
                        {...decreaseHours}
                      />
                    </div>
                    <div className="max-w-min bg-gray-100 rounded-md w-full text-right flex items-center border border-gray-100 dark:bg-gray-700 dark:border-gray-700">
                      <input
                        disabled
                        type="number"
                        value={date.getHours().toString().padStart(2, '0')}
                        className="text-center p-0 w-8 h-8 bg-transparent text-sm border border-transparent"
                      />
                      <span className="">:</span>
                      <input
                        disabled
                        type="number"
                        value={date.getMinutes().toString().padStart(2, '0')}
                        className="text-center p-0 w-8 h-8 bg-transparent text-sm border border-transparent"
                      />
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1">
                      <ChevronUpIcon
                        className="h-4 w-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={editDateField('minutes', 1)}
                        {...increaseMinutes}
                      />
                      <ChevronDownIcon
                        className="h-4 w-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={editDateField('minutes', -1)}
                        {...decreaseMinutes}
                      />
                    </div>
                  </div>
                  <div
                    className="p-1 text-blue-600 dark:text-blue-500 text-sm uppercase font-bold transition duration-100 ease-in-out border border-transparent rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    OK
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DateTimeInput;
