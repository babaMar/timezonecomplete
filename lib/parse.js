/**
 * Copyright(c) 2014 Spirit IT BV
 *
 * Functionality to parse a DateTime object to a string
 */
/// <reference path="../typings/lib.d.ts"/>
var util = require("util");
var basics = require("./basics");
var TimeStruct = basics.TimeStruct;
var token = require("./token");
var Tokenizer = token.Tokenizer;
var TokenType = token.DateTimeTokenType;
var timeZone = require("./timezone");
/**
 * Checks if a given datetime string is according to the given format
 * @param dateTimeString The string to test
 * @param formatString LDML format string
 * @param allowTrailing Allow trailing string after the date+time
 * @returns true iff the string is valid
 */
function parseable(dateTimeString, formatString, allowTrailing) {
    if (allowTrailing === void 0) { allowTrailing = true; }
    try {
        parse(dateTimeString, formatString, null, allowTrailing);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.parseable = parseable;
/**
 * Parse the supplied dateTime assuming the given format.
 *
 * @param dateTimeString The string to parse
 * @param formatString The formatting string to be applied
 * @return string
 */
function parse(dateTimeString, formatString, zone, allowTrailing) {
    if (allowTrailing === void 0) { allowTrailing = true; }
    if (!dateTimeString) {
        throw new Error("no date given");
    }
    if (!formatString) {
        throw new Error("no format given");
    }
    try {
        var tokenizer = new Tokenizer(formatString);
        var tokens = tokenizer.parseTokens();
        var result = {
            time: new TimeStruct(0, 1, 1, 0, 0, 0, 0),
            zone: zone
        };
        var pnr;
        var pzr;
        var remaining = dateTimeString;
        tokens.forEach(function (token) {
            var tokenResult;
            switch (token.type) {
                case TokenType.ERA:
                    // nothing
                    break;
                case TokenType.YEAR:
                    pnr = stripNumber(remaining);
                    remaining = pnr.remaining;
                    result.time.year = pnr.n;
                    break;
                case TokenType.QUARTER:
                    // nothing
                    break;
                case TokenType.MONTH:
                    pnr = stripNumber(remaining);
                    remaining = pnr.remaining;
                    result.time.month = pnr.n;
                    break;
                case TokenType.DAY:
                    pnr = stripNumber(remaining);
                    remaining = pnr.remaining;
                    result.time.day = pnr.n;
                    break;
                case TokenType.WEEKDAY:
                    // nothing
                    break;
                case TokenType.DAYPERIOD:
                    // nothing
                    break;
                case TokenType.HOUR:
                    pnr = stripNumber(remaining);
                    remaining = pnr.remaining;
                    result.time.hour = pnr.n;
                    break;
                case TokenType.MINUTE:
                    pnr = stripNumber(remaining);
                    remaining = pnr.remaining;
                    result.time.minute = pnr.n;
                    break;
                case TokenType.SECOND:
                    pnr = stripNumber(remaining);
                    remaining = pnr.remaining;
                    if (token.raw.charAt(0) === "s") {
                        result.time.second = pnr.n;
                    }
                    else if (token.raw.charAt(0) === "S") {
                        result.time.milli = pnr.n;
                    }
                    else {
                        throw new Error(util.format("unsupported second format '%s'", token.raw));
                    }
                    break;
                case TokenType.ZONE:
                    pzr = stripZone(remaining);
                    remaining = pzr.remaining;
                    result.zone = pzr.zone;
                    break;
                case TokenType.WEEK:
                    // nothing
                    break;
                default:
                case TokenType.IDENTITY:
                    remaining = stripRaw(remaining, token.raw);
                    break;
            }
        });
        if (!result.time.validate()) {
            throw new Error("resulting date invalid");
        }
        // always overwrite zone with given zone
        if (zone) {
            result.zone = zone;
        }
        if (remaining && !allowTrailing) {
            throw new Error(util.format("Invalid date '%s' not according to format '%s': trailing characters: '%s'", dateTimeString, formatString, remaining));
        }
        return result;
    }
    catch (e) {
        throw new Error(util.format("Invalid date '%s' not according to format '%s': %s", dateTimeString, formatString, e.message));
    }
}
exports.parse = parse;
function stripNumber(s) {
    var result = {
        n: NaN,
        remaining: s
    };
    var numberString = "";
    while (result.remaining.length > 0 && result.remaining.charAt(0).match(/\d/)) {
        numberString += result.remaining.charAt(0);
        result.remaining = result.remaining.substr(1);
    }
    // remove leading zeroes
    while (numberString.charAt(0) === "0" && numberString.length > 1) {
        numberString = numberString.substr(1);
    }
    result.n = parseInt(numberString, 10);
    if (numberString === "" || !isFinite(result.n)) {
        throw new Error(util.format("expected a number but got '%s'", numberString));
    }
    return result;
}
var WHITESPACE = [" ", "\t", "\r", "\v", "\n"];
function stripZone(s) {
    if (s.length === 0) {
        throw new Error("no zone given");
    }
    var result = {
        zone: null,
        remaining: s
    };
    var zoneString = "";
    while (result.remaining.length > 0 && WHITESPACE.indexOf(result.remaining.charAt(0)) === -1) {
        zoneString += result.remaining.charAt(0);
        result.remaining = result.remaining.substr(1);
    }
    result.zone = timeZone.zone(zoneString);
    return result;
}
function stripRaw(s, expected) {
    var remaining = s;
    var eremaining = expected;
    while (remaining.length > 0 && eremaining.length > 0 && remaining.charAt(0) === eremaining.charAt(0)) {
        remaining = remaining.substr(1);
        eremaining = eremaining.substr(1);
    }
    if (eremaining.length > 0) {
        throw new Error(util.format("expected '%s'", expected));
    }
    return remaining;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9wYXJzZS50cyJdLCJuYW1lcyI6WyJwYXJzZWFibGUiLCJwYXJzZSIsInN0cmlwTnVtYmVyIiwic3RyaXBab25lIiwic3RyaXBSYXciXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7QUFFSCwyQ0FBMkM7QUFFM0MsSUFBTyxJQUFJLFdBQVcsTUFBTSxDQUFDLENBQUM7QUFFOUIsSUFBTyxNQUFNLFdBQVcsVUFBVSxDQUFDLENBQUM7QUFDcEMsSUFBTyxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUV0QyxJQUFPLEtBQUssV0FBVyxTQUFTLENBQUMsQ0FBQztBQUNsQyxJQUFPLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO0FBRW5DLElBQU8sU0FBUyxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQztBQUczQyxJQUFPLFFBQVEsV0FBVyxZQUFZLENBQUMsQ0FBQztBQTRCeEM7Ozs7OztHQU1HO0FBQ0gsbUJBQTBCLGNBQXNCLEVBQUUsWUFBb0IsRUFBRSxhQUE2QjtJQUE3QkEsNkJBQTZCQSxHQUE3QkEsb0JBQTZCQTtJQUNwR0EsSUFBSUEsQ0FBQ0E7UUFDSkEsS0FBS0EsQ0FBQ0EsY0FBY0EsRUFBRUEsWUFBWUEsRUFBRUEsSUFBSUEsRUFBRUEsYUFBYUEsQ0FBQ0EsQ0FBQ0E7UUFDekRBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO0lBQ2JBLENBQUVBO0lBQUFBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQ1pBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO0lBQ2RBLENBQUNBO0FBQ0ZBLENBQUNBO0FBUGUsaUJBQVMsWUFPeEIsQ0FBQTtBQUVEOzs7Ozs7R0FNRztBQUNILGVBQXNCLGNBQXNCLEVBQUUsWUFBb0IsRUFBRSxJQUFlLEVBQUUsYUFBNkI7SUFBN0JDLDZCQUE2QkEsR0FBN0JBLG9CQUE2QkE7SUFDakhBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLGNBQWNBLENBQUNBLENBQUNB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QUFDQSxDQUFDQTtvQkFDekJBLEtBQUtBLENBQUNBO2dCQUNQQSxLQUFLQSxTQUFTQSxDQUFDQSxNQUFNQTtvQkFDcEJBLEdBQUdBLEdBQUdBLFdBQVdBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBO29CQUM3QkEsU0FBU0EsR0FBR0EsR0FBR0EsQ0FBQ0EsU0FBU0EsQ0FBQ0E7b0JBQzFCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDM0JBLEtBQUtBLENBQUNBO2dCQUNQQSxLQUFLQSxTQUFTQSxDQUFDQSxNQUFNQTtvQkFDcEJBLEdBQUdBLEdBQUdBLFdBQVdBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBO29CQUM3QkEsU0FBU0EsR0FBR0EsR0FBR0EsQ0FBQ0EsU0FBU0EsQ0FBQ0E7b0JBQzFCQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDakNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO29CQUM1QkEsQ0FBQ0E7b0JBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO3dCQUN4Q0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzNCQSxDQUFDQTtvQkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7d0JBQ1BBLE1BQU1BLElBQUlBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLGdDQUFnQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzNFQSxDQUFDQTtvQkFD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QSxVQUFVQSxJQUFJQSxNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUN6Q0EsTUFBTUEsQ0FBQ0EsU0FBU0EsR0FBR0EsTUFBTUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDL0NBLENBQUNBO0lBQ0RBLE1BQU1BLENBQUNBLElBQUlBLEdBQUdBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO0lBQ3hDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTtBQUNmQSxDQUFDQTtBQUVELGtCQUFrQixDQUFTLEVBQUUsUUFBZ0I7SUFDNUNDLElBQUlBLFNBQVNBLEdBQUdBLENBQUNBLENBQUNBO0lBQ2xCQSxJQUFJQSxVQUFVQSxHQUFHQSxRQUFRQSxDQUFDQTtJQUMxQkEsT0FBT0EsU0FBU0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsSUFBSUEsVUFBVUEsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsSUFBSUEsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsVUFBVUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0E7UUFDdEdBLFNBQVNBLEdBQUdBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQ2hDQSxVQUFVQSxHQUFHQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUNuQ0EsQ0FBQ0E7SUFDREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDM0JBLE1BQU1BLElBQUlBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLGVBQWVBLEVBQUVBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO0lBQ3pEQSxDQUFDQTtJQUNEQSxNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQTtBQUNsQkEsQ0FBQ0EiLCJmaWxlIjoibGliL3BhcnNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIENvcHlyaWdodChjKSAyMDE0IFNwaXJpdCBJVCBCVlxyXG4gKlxyXG4gKiBGdW5jdGlvbmFsaXR5IHRvIHBhcnNlIGEgRGF0ZVRpbWUgb2JqZWN0IHRvIGEgc3RyaW5nXHJcbiAqL1xyXG5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvbGliLmQudHNcIi8+XHJcblxyXG5pbXBvcnQgdXRpbCA9IHJlcXVpcmUoXCJ1dGlsXCIpO1xyXG5cclxuaW1wb3J0IGJhc2ljcyA9IHJlcXVpcmUoXCIuL2Jhc2ljc1wiKTtcclxuaW1wb3J0IFRpbWVTdHJ1Y3QgPSBiYXNpY3MuVGltZVN0cnVjdDtcclxuXHJcbmltcG9ydCB0b2tlbiA9IHJlcXVpcmUoXCIuL3Rva2VuXCIpO1xyXG5pbXBvcnQgVG9rZW5pemVyID0gdG9rZW4uVG9rZW5pemVyO1xyXG5pbXBvcnQgVG9rZW4gPSB0b2tlbi5Ub2tlbjtcclxuaW1wb3J0IFRva2VuVHlwZSA9IHRva2VuLkRhdGVUaW1lVG9rZW5UeXBlO1xyXG5cclxuaW1wb3J0IHN0cmluZ3MgPSByZXF1aXJlKFwiLi9zdHJpbmdzXCIpO1xyXG5pbXBvcnQgdGltZVpvbmUgPSByZXF1aXJlKFwiLi90aW1lem9uZVwiKTtcclxuaW1wb3J0IFRpbWVab25lID0gdGltZVpvbmUuVGltZVpvbmU7XHJcblxyXG4vKipcclxuICogVGltZVN0cnVjdCBwbHVzIHpvbmVcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgQXdhcmVUaW1lU3RydWN0IHtcclxuXHQvKipcclxuXHQgKiBUaGUgdGltZSBzdHJ1Y3RcclxuXHQgKi9cclxuXHR0aW1lOiBUaW1lU3RydWN0O1xyXG5cdC8qKlxyXG5cdCAqIFRoZSB0aW1lIHpvbmVcclxuXHQgKi9cclxuXHR6b25lPzogdGltZVpvbmUuVGltZVpvbmU7XHJcbn1cclxuXHJcbmludGVyZmFjZSBQYXJzZU51bWJlclJlc3VsdCB7XHJcblx0bjogbnVtYmVyO1xyXG5cdHJlbWFpbmluZzogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUGFyc2Vab25lUmVzdWx0IHtcclxuXHR6b25lOiBUaW1lWm9uZTtcclxuXHRyZW1haW5pbmc6IHN0cmluZztcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBDaGVja3MgaWYgYSBnaXZlbiBkYXRldGltZSBzdHJpbmcgaXMgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiBmb3JtYXRcclxuICogQHBhcmFtIGRhdGVUaW1lU3RyaW5nIFRoZSBzdHJpbmcgdG8gdGVzdFxyXG4gKiBAcGFyYW0gZm9ybWF0U3RyaW5nIExETUwgZm9ybWF0IHN0cmluZ1xyXG4gKiBAcGFyYW0gYWxsb3dUcmFpbGluZyBBbGxvdyB0cmFpbGluZyBzdHJpbmcgYWZ0ZXIgdGhlIGRhdGUrdGltZVxyXG4gKiBAcmV0dXJucyB0cnVlIGlmZiB0aGUgc3RyaW5nIGlzIHZhbGlkXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VhYmxlKGRhdGVUaW1lU3RyaW5nOiBzdHJpbmcsIGZvcm1hdFN0cmluZzogc3RyaW5nLCBhbGxvd1RyYWlsaW5nOiBib29sZWFuID0gdHJ1ZSk6IGJvb2xlYW4ge1xyXG5cdHRyeSB7XHJcblx0XHRwYXJzZShkYXRlVGltZVN0cmluZywgZm9ybWF0U3RyaW5nLCBudWxsLCBhbGxvd1RyYWlsaW5nKTtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH0gY2F0Y2ggKGUpIHtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBQYXJzZSB0aGUgc3VwcGxpZWQgZGF0ZVRpbWUgYXNzdW1pbmcgdGhlIGdpdmVuIGZvcm1hdC5cclxuICpcclxuICogQHBhcmFtIGRhdGVUaW1lU3RyaW5nIFRoZSBzdHJpbmcgdG8gcGFyc2VcclxuICogQHBhcmFtIGZvcm1hdFN0cmluZyBUaGUgZm9ybWF0dGluZyBzdHJpbmcgdG8gYmUgYXBwbGllZFxyXG4gKiBAcmV0dXJuIHN0cmluZ1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlKGRhdGVUaW1lU3RyaW5nOiBzdHJpbmcsIGZvcm1hdFN0cmluZzogc3RyaW5nLCB6b25lPzogVGltZVpvbmUsIGFsbG93VHJhaWxpbmc6IGJvb2xlYW4gPSB0cnVlKTogQXdhcmVUaW1lU3RydWN0IHtcclxuXHRpZiAoIWRhdGVUaW1lU3RyaW5nKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJubyBkYXRlIGdpdmVuXCIpO1xyXG5cdH1cclxuXHRpZiAoIWZvcm1hdFN0cmluZykge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwibm8gZm9ybWF0IGdpdmVuXCIpO1xyXG5cdH1cclxuXHR0cnkge1xyXG5cdFx0dmFyIHRva2VuaXplciA9IG5ldyBUb2tlbml6ZXIoZm9ybWF0U3RyaW5nKTtcclxuXHRcdHZhciB0b2tlbnM6IFRva2VuW10gPSB0b2tlbml6ZXIucGFyc2VUb2tlbnMoKTtcclxuXHRcdHZhciByZXN1bHQ6IEF3YXJlVGltZVN0cnVjdCA9IHtcclxuXHRcdFx0dGltZTogbmV3IFRpbWVTdHJ1Y3QoMCwgMSwgMSwgMCwgMCwgMCwgMCksXHJcblx0XHRcdHpvbmU6IHpvbmVcclxuXHRcdH07XHJcblx0XHR2YXIgcG5yOiBQYXJzZU51bWJlclJlc3VsdDtcclxuXHRcdHZhciBwenI6IFBhcnNlWm9uZVJlc3VsdDtcclxuXHRcdHZhciByZW1haW5pbmc6IHN0cmluZyA9IGRhdGVUaW1lU3RyaW5nO1xyXG5cdFx0dG9rZW5zLmZvckVhY2goKHRva2VuOiBUb2tlbik6IHZvaWQgPT4ge1xyXG5cdFx0XHR2YXIgdG9rZW5SZXN1bHQ6IHN0cmluZztcclxuXHRcdFx0c3dpdGNoICh0b2tlbi50eXBlKSB7XHJcblx0XHRcdFx0Y2FzZSBUb2tlblR5cGUuRVJBOlxyXG5cdFx0XHRcdFx0Ly8gbm90aGluZ1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBUb2tlblR5cGUuWUVBUjpcclxuXHRcdFx0XHRcdHBuciA9IHN0cmlwTnVtYmVyKHJlbWFpbmluZyk7XHJcblx0XHRcdFx0XHRyZW1haW5pbmcgPSBwbnIucmVtYWluaW5nO1xyXG5cdFx0XHRcdFx0cmVzdWx0LnRpbWUueWVhciA9IHBuci5uO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBUb2tlblR5cGUuUVVBUlRFUjpcclxuXHRcdFx0XHRcdC8vIG5vdGhpbmdcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgVG9rZW5UeXBlLk1PTlRIOlxyXG5cdFx0XHRcdFx0cG5yID0gc3RyaXBOdW1iZXIocmVtYWluaW5nKTtcclxuXHRcdFx0XHRcdHJlbWFpbmluZyA9IHBuci5yZW1haW5pbmc7XHJcblx0XHRcdFx0XHRyZXN1bHQudGltZS5tb250aCA9IHBuci5uO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBUb2tlblR5cGUuREFZOlxyXG5cdFx0XHRcdFx0cG5yID0gc3RyaXBOdW1iZXIocmVtYWluaW5nKTtcclxuXHRcdFx0XHRcdHJlbWFpbmluZyA9IHBuci5yZW1haW5pbmc7XHJcblx0XHRcdFx0XHRyZXN1bHQudGltZS5kYXkgPSBwbnIubjtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgVG9rZW5UeXBlLldFRUtEQVk6XHJcblx0XHRcdFx0XHQvLyBub3RoaW5nXHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIFRva2VuVHlwZS5EQVlQRVJJT0Q6XHJcblx0XHRcdFx0XHQvLyBub3RoaW5nXHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIFRva2VuVHlwZS5IT1VSOlxyXG5cdFx0XHRcdFx0cG5yID0gc3RyaXBOdW1iZXIocmVtYWluaW5nKTtcclxuXHRcdFx0XHRcdHJlbWFpbmluZyA9IHBuci5yZW1haW5pbmc7XHJcblx0XHRcdFx0XHRyZXN1bHQudGltZS5ob3VyID0gcG5yLm47XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIFRva2VuVHlwZS5NSU5VVEU6XHJcblx0XHRcdFx0XHRwbnIgPSBzdHJpcE51bWJlcihyZW1haW5pbmcpO1xyXG5cdFx0XHRcdFx0cmVtYWluaW5nID0gcG5yLnJlbWFpbmluZztcclxuXHRcdFx0XHRcdHJlc3VsdC50aW1lLm1pbnV0ZSA9IHBuci5uO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBUb2tlblR5cGUuU0VDT05EOlxyXG5cdFx0XHRcdFx0cG5yID0gc3RyaXBOdW1iZXIocmVtYWluaW5nKTtcclxuXHRcdFx0XHRcdHJlbWFpbmluZyA9IHBuci5yZW1haW5pbmc7XHJcblx0XHRcdFx0XHRpZiAodG9rZW4ucmF3LmNoYXJBdCgwKSA9PT0gXCJzXCIpIHtcclxuXHRcdFx0XHRcdFx0cmVzdWx0LnRpbWUuc2Vjb25kID0gcG5yLm47XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHRva2VuLnJhdy5jaGFyQXQoMCkgPT09IFwiU1wiKSB7XHJcblx0XHRcdFx0XHRcdHJlc3VsdC50aW1lLm1pbGxpID0gcG5yLm47XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IodXRpbC5mb3JtYXQoXCJ1bnN1cHBvcnRlZCBzZWNvbmQgZm9ybWF0ICclcydcIiwgdG9rZW4ucmF3KSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIFRva2VuVHlwZS5aT05FOlxyXG5cdFx0XHRcdFx0cHpyID0gc3RyaXBab25lKHJlbWFpbmluZyk7XHJcblx0XHRcdFx0XHRyZW1haW5pbmcgPSBwenIucmVtYWluaW5nO1xyXG5cdFx0XHRcdFx0cmVzdWx0LnpvbmUgPSBwenIuem9uZTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgVG9rZW5UeXBlLldFRUs6XHJcblx0XHRcdFx0XHQvLyBub3RoaW5nXHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdGNhc2UgVG9rZW5UeXBlLklERU5USVRZOlxyXG5cdFx0XHRcdFx0cmVtYWluaW5nID0gc3RyaXBSYXcocmVtYWluaW5nLCB0b2tlbi5yYXcpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0aWYgKCFyZXN1bHQudGltZS52YWxpZGF0ZSgpKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcInJlc3VsdGluZyBkYXRlIGludmFsaWRcIik7XHJcblx0XHR9XHJcblx0XHQvLyBhbHdheXMgb3ZlcndyaXRlIHpvbmUgd2l0aCBnaXZlbiB6b25lXHJcblx0XHRpZiAoem9uZSkge1xyXG5cdFx0XHRyZXN1bHQuem9uZSA9IHpvbmU7XHJcblx0XHR9XHJcblx0XHRpZiAocmVtYWluaW5nICYmICFhbGxvd1RyYWlsaW5nKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcih1dGlsLmZvcm1hdChcclxuXHRcdFx0XHRcIkludmFsaWQgZGF0ZSAnJXMnIG5vdCBhY2NvcmRpbmcgdG8gZm9ybWF0ICclcyc6IHRyYWlsaW5nIGNoYXJhY3RlcnM6ICclcydcIiwgZGF0ZVRpbWVTdHJpbmcsIGZvcm1hdFN0cmluZywgcmVtYWluaW5nKVxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9IGNhdGNoIChlKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IodXRpbC5mb3JtYXQoXCJJbnZhbGlkIGRhdGUgJyVzJyBub3QgYWNjb3JkaW5nIHRvIGZvcm1hdCAnJXMnOiAlc1wiLCBkYXRlVGltZVN0cmluZywgZm9ybWF0U3RyaW5nLCBlLm1lc3NhZ2UpKTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBzdHJpcE51bWJlcihzOiBzdHJpbmcpOiBQYXJzZU51bWJlclJlc3VsdCB7XHJcblx0dmFyIHJlc3VsdDogUGFyc2VOdW1iZXJSZXN1bHQgPSB7XHJcblx0XHRuOiBOYU4sXHJcblx0XHRyZW1haW5pbmc6IHNcclxuXHR9O1xyXG5cdHZhciBudW1iZXJTdHJpbmcgPSBcIlwiO1xyXG5cdHdoaWxlIChyZXN1bHQucmVtYWluaW5nLmxlbmd0aCA+IDAgJiYgcmVzdWx0LnJlbWFpbmluZy5jaGFyQXQoMCkubWF0Y2goL1xcZC8pKSB7XHJcblx0XHRudW1iZXJTdHJpbmcgKz0gcmVzdWx0LnJlbWFpbmluZy5jaGFyQXQoMCk7XHJcblx0XHRyZXN1bHQucmVtYWluaW5nID0gcmVzdWx0LnJlbWFpbmluZy5zdWJzdHIoMSk7XHJcblx0fVxyXG5cdC8vIHJlbW92ZSBsZWFkaW5nIHplcm9lc1xyXG5cdHdoaWxlIChudW1iZXJTdHJpbmcuY2hhckF0KDApID09PSBcIjBcIiAmJiBudW1iZXJTdHJpbmcubGVuZ3RoID4gMSkge1xyXG5cdFx0bnVtYmVyU3RyaW5nID0gbnVtYmVyU3RyaW5nLnN1YnN0cigxKTtcclxuXHR9XHJcblx0cmVzdWx0Lm4gPSBwYXJzZUludChudW1iZXJTdHJpbmcsIDEwKTtcclxuXHRpZiAobnVtYmVyU3RyaW5nID09PSBcIlwiIHx8ICFpc0Zpbml0ZShyZXN1bHQubikpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcih1dGlsLmZvcm1hdChcImV4cGVjdGVkIGEgbnVtYmVyIGJ1dCBnb3QgJyVzJ1wiLCBudW1iZXJTdHJpbmcpKTtcclxuXHR9XHJcblx0cmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxudmFyIFdISVRFU1BBQ0UgPSBbXCIgXCIsIFwiXFx0XCIsIFwiXFxyXCIsIFwiXFx2XCIsIFwiXFxuXCJdO1xyXG5cclxuZnVuY3Rpb24gc3RyaXBab25lKHM6IHN0cmluZyk6IFBhcnNlWm9uZVJlc3VsdCB7XHJcblx0aWYgKHMubGVuZ3RoID09PSAwKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJubyB6b25lIGdpdmVuXCIpO1xyXG5cdH1cclxuXHR2YXIgcmVzdWx0OiBQYXJzZVpvbmVSZXN1bHQgPSB7XHJcblx0XHR6b25lOiBudWxsLFxyXG5cdFx0cmVtYWluaW5nOiBzXHJcblx0fTtcclxuXHR2YXIgem9uZVN0cmluZyA9IFwiXCI7XHJcblx0d2hpbGUgKHJlc3VsdC5yZW1haW5pbmcubGVuZ3RoID4gMCAmJiBXSElURVNQQUNFLmluZGV4T2YocmVzdWx0LnJlbWFpbmluZy5jaGFyQXQoMCkpID09PSAtMSkge1xyXG5cdFx0em9uZVN0cmluZyArPSByZXN1bHQucmVtYWluaW5nLmNoYXJBdCgwKTtcclxuXHRcdHJlc3VsdC5yZW1haW5pbmcgPSByZXN1bHQucmVtYWluaW5nLnN1YnN0cigxKTtcclxuXHR9XHJcblx0cmVzdWx0LnpvbmUgPSB0aW1lWm9uZS56b25lKHpvbmVTdHJpbmcpO1xyXG5cdHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0cmlwUmF3KHM6IHN0cmluZywgZXhwZWN0ZWQ6IHN0cmluZyk6IHN0cmluZyB7XHJcblx0dmFyIHJlbWFpbmluZyA9IHM7XHJcblx0dmFyIGVyZW1haW5pbmcgPSBleHBlY3RlZDtcclxuXHR3aGlsZSAocmVtYWluaW5nLmxlbmd0aCA+IDAgJiYgZXJlbWFpbmluZy5sZW5ndGggPiAwICYmIHJlbWFpbmluZy5jaGFyQXQoMCkgPT09IGVyZW1haW5pbmcuY2hhckF0KDApKSB7XHJcblx0XHRyZW1haW5pbmcgPSByZW1haW5pbmcuc3Vic3RyKDEpO1xyXG5cdFx0ZXJlbWFpbmluZyA9IGVyZW1haW5pbmcuc3Vic3RyKDEpO1xyXG5cdH1cclxuXHRpZiAoZXJlbWFpbmluZy5sZW5ndGggPiAwKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IodXRpbC5mb3JtYXQoXCJleHBlY3RlZCAnJXMnXCIsIGV4cGVjdGVkKSk7XHJcblx0fVxyXG5cdHJldHVybiByZW1haW5pbmc7XHJcbn1cclxuXHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==