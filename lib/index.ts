/**
 * Copyright(c) 2014 Spirit IT BV
 *
 * Date and Time utility functions - main index
 */

/// <reference path="../typings/lib.d.ts"/>

"use strict";

/* tslint:disable:no-unused-expression */

import basics = require("./basics"); basics;
export import TimeUnit = basics.TimeUnit;
export import WeekDay = basics.WeekDay;

export import isLeapYear = basics.isLeapYear;
export import daysInMonth = basics.daysInMonth;
export import daysInYear = basics.daysInYear;
export import dayOfYear = basics.dayOfYear;
export import lastWeekDayOfMonth = basics.lastWeekDayOfMonth;
export import weekDayOnOrAfter = basics.weekDayOnOrAfter;
export import weekDayOnOrBefore = basics.weekDayOnOrBefore;

import datetime = require("./datetime"); datetime;
export import DateTime = datetime.DateTime;

import duration = require("./duration"); duration;
export import Duration = duration.Duration;

import javascript = require("./javascript"); javascript;
export import DateFunctions = javascript.DateFunctions;

import period = require("./period"); period;
export import Period = period.Period;
export import PeriodDst = period.PeriodDst;
export import periodDstToString = period.periodDstToString;

import timesource = require("./timesource"); timesource;
export import TimeSource = timesource.TimeSource;
export import RealTimeSource = timesource.RealTimeSource;

import timezone = require("./timezone"); timezone;
export import NormalizeOption = timezone.NormalizeOption;
export import TimeZoneKind = timezone.TimeZoneKind;
export import TimeZone = timezone.TimeZone;


