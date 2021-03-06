﻿/**
 * Copyright(c) 2014 Spirit IT BV
 */

"use strict";

import sourcemapsupport = require("source-map-support");
// Enable source-map support for backtraces. Causes TS files & linenumbers to show up in them.
sourcemapsupport.install({ handleUncaughtExceptions: false });

import * as assert from "assert";
import { expect } from "chai";

import {format, TimeStruct, TimeZone} from "../lib/index";

/*
 * Dummy implementation of a DateTimeAccess class, for testing the format
 */

describe("format", (): void => {

	describe("identity", (): void => {
		it("should return the raw contents", (): void => {
			const dateTime = TimeStruct.fromComponents();
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, dateTime, localZone, "'abcdefghijklmnopqrstuvwxyz'");
			expect(result).to.equal("abcdefghijklmnopqrstuvwxyz");
		});
	});

	describe("formatEra", (): void => {
		it("should return BC for years <>> 0", (): void => {
			const dateTime = TimeStruct.fromComponents(-1);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "G");
			expect(result).to.equal("BC");
		});
		it("should return AD for years > 0", (): void => {
			const dateTime = TimeStruct.fromComponents(1);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "G");
			expect(result).to.equal("AD");
		});
		it("should return Before Christ for years < 0", (): void => {
			const dateTime = TimeStruct.fromComponents(-1);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "GGGG");
			expect(result).to.equal("Before Christ");
		});
		it("should return Anno Domini for years > 0", (): void => {
			const dateTime = TimeStruct.fromComponents(1);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "GGGG");
			expect(result).to.equal("Anno Domini");
		});
		it("should return B for years < 0", (): void => {
			const dateTime = TimeStruct.fromComponents(-1);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "GGGGG");
			expect(result).to.equal("B");
		});
		it("should return A for years > 0", (): void => {
			const dateTime = TimeStruct.fromComponents(1);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "GGGGG");
			expect(result).to.equal("A");
		});
		it("should throw if the token is too long", (): void => {
			const dateTime = TimeStruct.fromComponents(-1);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			assert.throws((): void => { format(dateTime, utcTime, localZone, "GGGGGG"); });
		});
	});

	describe("formatYear", (): void => {
		it("should return at least one digit year for y", (): void => {
			const dateTime = TimeStruct.fromComponents(123);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "y");
			expect(result).to.equal("123");
		});
		it("should return at least two digit year for yy", (): void => {
			const dateTime = TimeStruct.fromComponents(3);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "yy");
			expect(result).to.equal("03");
		});
		it("should return exactly two digit year for yy", (): void => {
			const dateTime = TimeStruct.fromComponents(1997);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "yy");
			expect(result).to.equal("97");
		});
		it("should pad to four digit year for yyyy", (): void => {
			const dateTime = TimeStruct.fromComponents(123);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "yyyy");
			expect(result).to.equal("0123");
		});
		it("should return at least four digit year for yyyy", (): void => {
			const dateTime = TimeStruct.fromComponents(12345);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "yyyy");
			expect(result).to.equal("12345");
		});
	});

	describe("formatQuarter", (): void => {
		it("should return the numerical value of the quarter of q", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "q");
			expect(result).to.equal("01");
		});
		it("should return the numerical value of the quarter of qq", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 3);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "qq");
			expect(result).to.equal("01");
		});
		it("should return the short value of the quarter of qqq", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 4);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "qqq");
			expect(result).to.equal("Q2");
		});
		it("should return the long value of the quarter of qqqq", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 12);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "qqqq");
			expect(result).to.equal("4th quarter");
		});
		it("should return only the number of the quarter of qqqq", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 9);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "qqqqq");
			expect(result).to.equal("3");
		});
		it("should throw if the token is too long", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 5);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			assert.throws((): void => { format(dateTime, utcTime, localZone, "qqqqqq"); });
		});
	});

	describe("formatMonth", (): void => {
		it("should return just the number of the month for M", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 9);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "M");
			expect(result).to.equal("9");
		});
		it("should return just the number of the month for M", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 11);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "M");
			expect(result).to.equal("11");
		});
		it("should return just the number of the month for MM, padded to two characters", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 3);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "MM");
			expect(result).to.equal("03");
		});
		it("should return the shortened name of the month with MMM", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 8);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "MMM");
			expect(result).to.equal("Aug");
		});
		it("should return the full name of the month with MMMM", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 2);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "MMMM");
			expect(result).to.equal("February");
		});
		it("should return the narrow name of the month with MMMMM", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 11);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "MMMMM");
			expect(result).to.equal("N");
		});
		it("should throw if the token is too long", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			assert.throws((): void => { format(dateTime, utcTime, localZone, "MMMMMM"); });
		});
		it("should use given format options", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 11);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			expect(format(dateTime, utcTime, localZone, "MMM", {
				shortMonthNames: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]
			})).to.equal("K");
			expect(format(dateTime, utcTime, localZone, "MMMM", {
				longMonthNames: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]
			})).to.equal("K");
			expect(format(dateTime, utcTime, localZone, "MMMMM", {
				monthLetters: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]
			})).to.equal("K");
		});
	});

	describe("formatWeek", (): void => {
		it("should format the week number with w", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 1, 4);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "w");
			expect(result).to.equal("1");
		});
		it("should format the week number with w", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 8, 17);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "w");
			expect(result).to.equal("33");
		});
		it("should format the week number with ww", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 1, 4);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "ww");
			expect(result).to.equal("01");
		});
		it("should format the week number with ww", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 8, 17);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "ww");
			expect(result).to.equal("33");
		});
		it("should format the month week number with W", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 8, 17);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "W");
			expect(result).to.equal("2");
		});

	});

	describe("formatDay", (): void => {
		it("should return the number of the day with d", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 8);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "d");
			expect(result).to.equal("8");
		});
		it("should return the number of the day with d", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 25);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "d");
			expect(result).to.equal("25");
		});
		it("should return the number of the day with dd, padded to two characters", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 6);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "dd");
			expect(result).to.equal("06");
		});
		it("should return the day of the year with D", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 2, 1);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "D");
			expect(result).to.equal("32");
		});
		it("should return the day of the year with DD", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 8, 17);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "DD");
			expect(result).to.equal("229");
		});

	});

	describe("formatWeekday", (): void => {
		it("should return the abbreviated name for E", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 8, 16);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "E");
			expect(result).to.equal("Sat");
		});
		it("should return the abbreviated name for EE", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 8, 21);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "EE");
			expect(result).to.equal("Thu");
		});
		it("should return the abbreviated name for EEE", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 8, 18);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "EEE");
			expect(result).to.equal("Mon");
		});
		it("should return the full name for EEEE", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 8, 20);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "EEEE");
			expect(result).to.equal("Wednesday");
		});
		it("should return the narrow name for EEEEE", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 8, 15);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "EEEEE");
			expect(result).to.equal("F");
		});
		it("should return the short name for EEEEEE", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 8, 17);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "EEEEEE");
			expect(result).to.equal("Su");
		});

		it("should return the weekday number for e", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 8, 19);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "e");
			expect(result).to.equal("2");
		});

		it("should throw if the token is too long", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 8, 19);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			assert.throws((): void => { format(dateTime, utcTime, localZone, "EEEEEEE"); });
		});
	});

	describe("formatDayPeriod", (): void => {
		it("should return AM for the morning", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 11);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "a");
			expect(result).to.equal("AM");
		});
		it("should return PM for the afternoon", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 23);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "a");
			expect(result).to.equal("PM");
		});
	});

	describe("formatHour", (): void => {
		it("should return 1-12 hour period for format h", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 0);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "h");
			expect(result).to.equal("12");
		});
		it("should return 1-12 hour period for format h", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 22);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "h");
			expect(result).to.equal("10");
		});
		it("should return 1-12 hour period for format hh, padding to two characters", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 1);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "hh");
			expect(result).to.equal("01");
		});
		it("should return 1-12 hour period for format hh", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 20);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "hh");
			expect(result).to.equal("08");
		});
		it("should return 0-11 hour period for format K", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 0);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "K");
			expect(result).to.equal("0");
		});
		it("should return 0-11 hour period for format K", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 22);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "K");
			expect(result).to.equal("10");
		});
		it("should return 0-11 hour period for format KK, padding to two characters", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 1);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "KK");
			expect(result).to.equal("01");
		});
		it("should return 0-11 hour period for format KK", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 20);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "KK");
			expect(result).to.equal("08");
		});

		it("should return 1-24 hour period for format k", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 0);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "k");
			expect(result).to.equal("24");
		});
		it("should return 1-24 hour period for format k", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 22);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "k");
			expect(result).to.equal("22");
		});
		it("should return 1-24 hour period for format kk, padding to two characters", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 1);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "kk");
			expect(result).to.equal("01");
		});
		it("should return 1-24 hour period for format kk", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 20);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "kk");
			expect(result).to.equal("20");
		});
		it("should return 0-23 hour period for format H", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 0);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "H");
			expect(result).to.equal("0");
		});
		it("should return 0-23 hour period for format H", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 22);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "H");
			expect(result).to.equal("22");
		});
		it("should return 0-23 hour period for format HH, padding to two characters", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 1);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "HH");
			expect(result).to.equal("01");
		});
		it("should return 0-23 hour period for format HH", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 20);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "HH");
			expect(result).to.equal("20");
		});
	});

	describe("formatMinute", (): void => {
		it("should format minutes for format m", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 0, 5);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "m");
			expect(result).to.equal("5");
		});
		it("should format minutes for format m", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 0, 38);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "m");
			expect(result).to.equal("38");
		});
		it("should format minutes for format mm, padding to two characters", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 0, 5);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "mm");
			expect(result).to.equal("05");
		});
		it("should format minutes for format mm", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 0, 38);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "mm");
			expect(result).to.equal("38");
		});
	});

	describe("formatSecond", (): void => {
		it("should format seconds for format s", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 0, 0, 5);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "s");
			expect(result).to.equal("5");
		});
		it("should format seconds for format s", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 0, 0, 38);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "s");
			expect(result).to.equal("38");
		});
		it("should format seconds for format ss, padding to two characters", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 0, 0, 5);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "ss");
			expect(result).to.equal("05");
		});
		it("should format seconds for format ss", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 0, 0, 38);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "ss");
			expect(result).to.equal("38");
		});

		it("should get the fraction of a second for format S", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 0, 0, 0, 338);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "S");
			expect(result).to.equal("3");
		});
		it("should get the fraction of a second for format SS", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 0, 0, 0, 2);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "SS");
			expect(result).to.equal("00");
		});
		it("should get the fraction of a second for format SSS", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 0, 0, 0, 891);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "SSS");
			expect(result).to.equal("891");
		});
		it("should get the fraction of a second for format SSSS", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 0, 0, 0, 44);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "SSSS");
			expect(result).to.equal("0440");
		});

		it("should get the seconds of a day for format A", (): void => {
			const dateTime = TimeStruct.fromComponents(1970, 1, 1, 3, 14, 15);
			const utcTime = dateTime;
			const localZone: TimeZone | null | null = null;
			const result = format(dateTime, utcTime, localZone, "A");
			expect(result).to.equal("11655");
		});
	});

	describe("formatTimeZone", (): void => {
		it("should not crash on NULL zone", (): void => {
			const dateTime = TimeStruct.fromComponents();
			const utcTime = dateTime;
			expect(format(dateTime, utcTime, null, "z")).to.equal("");
			expect(format(dateTime, utcTime, null, "zzzz")).to.equal("");
			expect(format(dateTime, utcTime, null, "zzzzz")).to.equal("");
			expect(format(dateTime, utcTime, null, "O")).to.equal("");
			expect(format(dateTime, utcTime, null, "OOOO")).to.equal("");
			expect(format(dateTime, utcTime, null, "v")).to.equal("");
			expect(format(dateTime, utcTime, null, "vvvv")).to.equal("");
			expect(format(dateTime, utcTime, null, "V")).to.equal("");
			expect(format(dateTime, utcTime, null, "VV")).to.equal("");
			expect(format(dateTime, utcTime, null, "VVV")).to.equal("");
			expect(format(dateTime, utcTime, null, "VVVV")).to.equal("");
			expect(format(dateTime, utcTime, null, "VVVVVV")).to.equal("");
		});

		it("should not add space for NULL zone", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = dateTime;
			expect(format(dateTime, utcTime, null, "MM/dd/yyyy z")).to.equal("07/15/2014");
		});

		it("should get the short specific name of the timezone for format z", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 22);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "z");
			expect(result).to.equal("CEST");
		});
		it("should get the short specific name of the timezone for format z", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 2, 15);
			const utcTime = TimeStruct.fromComponents(2014, 2, 14, 22);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "z");
			expect(result).to.equal("CET");
		});
		it("should get the long specific name of the timezone for format zzzz", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 22);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "zzzz");
			expect(result).to.equal("Europe/Amsterdam"); // Should be Central European Summer Time
		});
		it("should get the long specific name of the timezone for format zzzz", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 22);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "zzzz");
			expect(result).to.equal("Europe/Amsterdam"); // Should be Central European Time
		});
		it("should throw if the token is too long", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 22);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			assert.throws((): void => { format(dateTime, utcTime, localZone, "zzzzz"); });
		});

		it("should get the short specific name of the timezone for format O", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 22);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "O");
			expect(result).to.equal("UTC+2");
		});
		it("should get the short specific name of the timezone for format O", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 23);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "O");
			expect(result).to.equal("UTC+1");
		});
		it("should get the short specific name of the timezone for format OOOO", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 22);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "OOOO");
			expect(result).to.equal("UTC+2:00");
		});
		it("should get the short specific name of the timezone for format OOOO", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 23);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "OOOO");
			expect(result).to.equal("UTC+1:00");
		});

		it("should get the short specific name of the timezone for format v", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 22);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "v");
			expect(result).to.equal("CET");
		});
		it("should get the short specific name of the timezone for format v", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 23);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "v");
			expect(result).to.equal("CET");
		});
		it("should get the long specific name of the timezone for format vvvv", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 22);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "vvvv");
			expect(result).to.equal("Europe/Amsterdam"); // Should be Central European Time
		});
		it("should get the long specific name of the timezone for format vvvv", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 22);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "vvvv");
			expect(result).to.equal("Europe/Amsterdam"); // Should be Central European Time
		});

		it("should get the long Timezone ID for format V", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 22);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "V");
			expect(result).to.equal("unk");
		});
		it("should get the long Timezone ID for format VV", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 22);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "VV");
			expect(result).to.equal("Europe/Amsterdam");
		});
		it("should get the long Timezone ID for format VVV", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 22);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "VVV");
			expect(result).to.equal("Unknown");
		});
		it("should get the long Timezone ID for format VVVV", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 22);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "VVVV");
			expect(result).to.equal("Unknown");
		});
		it("should throw if the token is too long", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 21, 30);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			assert.throws((): void => { format(dateTime, utcTime, localZone, "VVVVVV"); });
		});

		it("should get the basic ISO format for format X with positive offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 21, 30);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "X");
			expect(result).to.equal("+0230");
		});
		it("should get the basic ISO format for format X with negative offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15, 8);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "X");
			expect(result).to.equal("-08");
		});
		it("should get the basic ISO format for format X with 0 offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "X");
			expect(result).to.equal("Z");
		});

		it("should get the basic ISO format for format XX with positive offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 21, 30);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "XX");
			expect(result).to.equal("+0230");
		});
		it("should get the basic ISO format for format XX with negative offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15, 8);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "XX");
			expect(result).to.equal("-0800");
		});
		it("should get the basic ISO format for format XX with 0 offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "XX");
			expect(result).to.equal("Z");
		});

		it("should get the basic ISO format for format XXX with positive offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 21, 30);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "XXX");
			expect(result).to.equal("+02:30");
		});
		it("should get the basic ISO format for format XXX with negative offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15, 8);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "XXX");
			expect(result).to.equal("-08:00");
		});
		it("should get the basic ISO format for format XXX with 0 offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "XXX");
			expect(result).to.equal("Z");
		});

		it("should get the basic ISO format for format XXXX with positive offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 21, 30);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "XXXX");
			expect(result).to.equal("+0230");
		});
		it("should get the basic ISO format for format XXXX with negative offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15, 8);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "XXXX");
			expect(result).to.equal("-0800");
		});
		it("should get the basic ISO format for format XXXX with 0 offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "XXXX");
			expect(result).to.equal("Z");
		});

		it("should get the basic ISO format for format XXXXX with positive offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 21, 30);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "XXXXX");
			expect(result).to.equal("+02:30");
		});
		it("should get the basic ISO format for format XXXXX with negative offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15, 8);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "XXXXX");
			expect(result).to.equal("-08:00");
		});
		it("should get the basic ISO format for format XXXXX with 0 offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "XXXXX");
			expect(result).to.equal("Z");
		});
		it("should throw if the token is too long", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 21, 30);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			assert.throws((): void => { format(dateTime, utcTime, localZone, "XXXXXX"); });
		});

		it("should get the basic ISO format for format x with positive offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 21, 30);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "x");
			expect(result).to.equal("+0230");
		});
		it("should get the basic ISO format for format x with negative offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15, 8);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "x");
			expect(result).to.equal("-08");
		});
		it("should get the basic ISO format for format x with 0 offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "x");
			expect(result).to.equal("+00");
		});

		it("should get the basic ISO format for format xx with positive offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 21, 30);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "xx");
			expect(result).to.equal("+0230");
		});
		it("should get the basic ISO format for format xx with negative offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15, 8);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "xx");
			expect(result).to.equal("-0800");
		});
		it("should get the basic ISO format for format xx with 0 offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "xx");
			expect(result).to.equal("+0000");
		});

		it("should get the basic ISO format for format xxx with positive offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 21, 30);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "xxx");
			expect(result).to.equal("+02:30");
		});
		it("should get the basic ISO format for format xxx with negative offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15, 8);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "xxx");
			expect(result).to.equal("-08:00");
		});
		it("should get the basic ISO format for format xxx with 0 offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "xxx");
			expect(result).to.equal("+00:00");
		});

		it("should get the basic ISO format for format xxxx with positive offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 21, 30);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "xxxx");
			expect(result).to.equal("+0230");
		});
		it("should get the basic ISO format for format xxxx with negative offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15, 8);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "xxxx");
			expect(result).to.equal("-0800");
		});
		it("should get the basic ISO format for format xxxx with 0 offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "xxxx");
			expect(result).to.equal("+0000");
		});

		it("should get the basic ISO format for format xxxxx with positive offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 21, 30);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "xxxxx");
			expect(result).to.equal("+02:30");
		});
		it("should get the basic ISO format for format xxxxx with negative offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15, 8);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "xxxxx");
			expect(result).to.equal("-08:00");
		});
		it("should get the basic ISO format for format xxxxx with 0 offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "xxxxx");
			expect(result).to.equal("+00:00");
		});
		it("should throw if the token is too long", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			assert.throws((): void => { format(dateTime, utcTime, localZone, "xxxxxx"); });
		});

		it("should get the basic ISO format for format Z with positive offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 21, 30);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "Z");
			expect(result).to.equal("+0230");
		});
		it("should get the basic ISO format for format Z with negative offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15, 8);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "Z");
			expect(result).to.equal("-0800");
		});
		it("should get the basic ISO format for format Z with 0 offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "Z");
			expect(result).to.equal("+0000");
		});

		it("should get the basic ISO format for format ZZ with positive offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 21, 30);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
		const result = format(dateTime, utcTime, localZone, "ZZ");
			expect(result).to.equal("+0230");
		});
		it("should get the basic ISO format for format ZZ with negative offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15, 8);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "ZZ");
			expect(result).to.equal("-0800");
		});
		it("should get the basic ISO format for format ZZ with 0 offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "ZZ");
			expect(result).to.equal("+0000");
		});

		it("should get the basic ISO format for format ZZZ with positive offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 21, 30);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "ZZZ");
			expect(result).to.equal("+0230");
		});
		it("should get the basic ISO format for format ZZZ with negative offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15, 8);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
		const result = format(dateTime, utcTime, localZone, "ZZZ");
			expect(result).to.equal("-0800");
		});
		it("should get the basic ISO format for format ZZZ with 0 offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "ZZZ");
			expect(result).to.equal("+0000");
		});

		it("should get the basic ISO format for format ZZZZ with positive offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 21, 30);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "ZZZZ");
			expect(result).to.equal("UTC+2:30");
		});
		it("should get the basic ISO format for format ZZZZ with negative offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15, 8);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "ZZZZ");
			expect(result).to.equal("UTC-8:00");
		});
		it("should get the basic ISO format for format ZZZZ with 0 offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "ZZZZ");
			expect(result).to.equal("UTC+0:00");
		});

		it("should get the basic ISO format for format ZZZZZ with positive offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 14, 21, 30);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "ZZZZZ");
			expect(result).to.equal("+02:30");
		});
		it("should get the basic ISO format for format ZZZZZ with negative offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15, 8);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			const result = format(dateTime, utcTime, localZone, "ZZZZZ");
			expect(result).to.equal("-08:00");
		});
		it("should get the basic ISO format for format ZZZZZ with 0 offset", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
		const result = format(dateTime, utcTime, localZone, "ZZZZZ");
			expect(result).to.equal("+00:00");
		});
		it("should throw if the token is too long", (): void => {
			const dateTime = TimeStruct.fromComponents(2014, 7, 15);
			const utcTime = TimeStruct.fromComponents(2014, 7, 15);
			const localZone: TimeZone | null | null = TimeZone.zone("Europe/Amsterdam");
			assert.throws((): void => { format(dateTime, utcTime, localZone, "ZZZZZZ"); });
		});

	});
});
