(function(context, f) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], f);
    } else {
        context.securityKeyboard = f(jQuery);
    }
}
)(this, function($) {

    /* 源码文件 执行依赖打包放在public/keyboard-pc */ 

    // BigInt, a suite of routines for performing multiple-precision arithmetic in
    // JavaScript.
    //
    // Copyright 1998-2005 David Shapiro.
    //
    // You may use, re-use, abuse,
    // copy, and modify this code to your liking, but please keep this header.
    // Thanks!
    //
    // Dave Shapiro
    // dave@ohdave.com

    // IMPORTANT THING: Be sure to set maxDigits according to your precision
    // needs. Use the setMaxDigits() function to do this. See comments below.
    //
    // Tweaked by Ian Bunning
    // Alterations:
    // Fix bug in function biFromHex(s) to allow
    // parsing of strings of length != 0 (mod 4)

    // Changes made by Dave Shapiro as of 12/30/2004:
    //
    // The BigInt() constructor doesn't take a string anymore. If you want to
    // create a BigInt from a string, use biFromDecimal() for base-10
    // representations, biFromHex() for base-16 representations, or
    // biFromString() for base-2-to-36 representations.
    //
    // biFromArray() has been removed. Use biCopy() instead, passing a BigInt
    // instead of an array.
    //
    // The BigInt() constructor now only constructs a zeroed-out array.
    // Alternatively, if you pass <true>, it won't construct any array. See the
    // biCopy() method for an example of this.
    //
    // Be sure to set maxDigits depending on your precision needs. The default
    // zeroed-out array ZERO_ARRAY is constructed inside the setMaxDigits()
    // function. So use this function to set the variable. DON'T JUST SET THE
    // VALUE. USE THE FUNCTION.
    //
    // ZERO_ARRAY exists to hopefully speed up construction of BigInts(). By
    // precalculating the zero array, we can just use slice(0) to make copies of
    // it. Presumably this calls faster native code, as opposed to setting the
    // elements one at a time. I have not done any timing tests to verify this
    // claim.

    // Max number = 10^16 - 2 = 9999999999999998;
    //               2^53     = 9007199254740992;

    var biRadixBase = 2;
    var biRadixBits = 16;
    var bitsPerDigit = biRadixBits;
    var biRadix = 1 << 16;
    // = 2^16 = 65536
    var biHalfRadix = biRadix >>> 1;
    var biRadixSquared = biRadix * biRadix;
    var maxDigitVal = biRadix - 1;
    var maxInteger = 9999999999999998;

    // maxDigits:
    // Change this to accommodate your largest number size. Use setMaxDigits()
    // to change it!
    //
    // In general, if you're working with numbers of size N bits, you'll need 2*N
    // bits of storage. Each digit holds 16 bits. So, a 1024-bit key will need
    //
    // 1024 * 2 / 16 = 128 digits of storage.
    //

    var maxDigits;
    var ZERO_ARRAY;
    var bigZero, bigOne;

    function setMaxDigits(value) {
        maxDigits = value;
        ZERO_ARRAY = new Array(maxDigits);
        for (var iza = 0; iza < ZERO_ARRAY.length; iza++)
            ZERO_ARRAY[iza] = 0;
        bigZero = new BigInt();
        bigOne = new BigInt();
        bigOne.digits[0] = 1;
    }

    setMaxDigits(20);

    // The maximum number of digits in base 10 you can convert to an
    // integer without JavaScript throwing up on you.
    var dpl10 = 15;
    // lr10 = 10 ^ dpl10
    var lr10 = biFromNumber(1000000000000000);

    function BigInt(flag) {
        if (typeof flag == "boolean" && flag == true) {
            this.digits = null;
        } else {
            this.digits = ZERO_ARRAY.slice(0);
        }
        this.isNeg = false;
    }

    function biFromDecimal(s) {
        var isNeg = s.charAt(0) == "-";
        var i = isNeg ? 1 : 0;
        var result;
        // Skip leading zeros.
        while (i < s.length && s.charAt(i) == "0")
            ++i;
        if (i == s.length) {
            result = new BigInt();
        } else {
            var digitCount = s.length - i;
            var fgl = digitCount % dpl10;
            if (fgl == 0)
                fgl = dpl10;
            result = biFromNumber(Number(s.substr(i, fgl)));
            i += fgl;
            while (i < s.length) {
                result = biAdd(biMultiply(result, lr10), biFromNumber(Number(s.substr(i, dpl10))));
                i += dpl10;
            }
            result.isNeg = isNeg;
        }
        return result;
    }

    function biCopy(bi) {
        var result = new BigInt(true);
        result.digits = bi.digits.slice(0);
        result.isNeg = bi.isNeg;
        return result;
    }

    function biFromNumber(i) {
        var result = new BigInt();
        result.isNeg = i < 0;
        i = Math.abs(i);
        var j = 0;
        while (i > 0) {
            result.digits[j++] = i & maxDigitVal;
            i = Math.floor(i / biRadix);
        }
        return result;
    }

    function reverseStr(s) {
        var result = "";
        for (var i = s.length - 1; i > -1; --i) {
            result += s.charAt(i);
        }
        return result;
    }

    var hexatrigesimalToChar = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z");

    function biToString(x, radix) {
        // 2 <= radix <= 36
        var b = new BigInt();
        b.digits[0] = radix;
        var qr = biDivideModulo(x, b);
        var result = hexatrigesimalToChar[qr[1].digits[0]];
        while (biCompare(qr[0], bigZero) == 1) {
            qr = biDivideModulo(qr[0], b);
            digit = qr[1].digits[0];
            result += hexatrigesimalToChar[qr[1].digits[0]];
        }
        return (x.isNeg ? "-" : "") + reverseStr(result);
    }

    function biToDecimal(x) {
        var b = new BigInt();
        b.digits[0] = 10;
        var qr = biDivideModulo(x, b);
        var result = String(qr[1].digits[0]);
        while (biCompare(qr[0], bigZero) == 1) {
            qr = biDivideModulo(qr[0], b);
            result += String(qr[1].digits[0]);
        }
        return (x.isNeg ? "-" : "") + reverseStr(result);
    }

    var hexToChar = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");

    function digitToHex(n) {
        var mask = 0xf;
        var result = "";
        for (i = 0; i < 4; ++i) {
            result += hexToChar[n & mask];
            n >>>= 4;
        }
        return reverseStr(result);
    }

    function biToHex(x) {
        var result = "";
        var n = biHighIndex(x);
        for (var i = biHighIndex(x); i > -1; --i) {
            result += digitToHex(x.digits[i]);
        }
        return result;
    }

    function charToHex(c) {
        var ZERO = 48;
        var NINE = ZERO + 9;
        var littleA = 97;
        var littleZ = littleA + 25;
        var bigA = 65;
        var bigZ = 65 + 25;
        var result;

        if (c >= ZERO && c <= NINE) {
            result = c - ZERO;
        } else if (c >= bigA && c <= bigZ) {
            result = 10 + c - bigA;
        } else if (c >= littleA && c <= littleZ) {
            result = 10 + c - littleA;
        } else {
            result = 0;
        }
        return result;
    }

    function hexToDigit(s) {
        var result = 0;
        var sl = Math.min(s.length, 4);
        for (var i = 0; i < sl; ++i) {
            result <<= 4;
            result |= charToHex(s.charCodeAt(i));
        }
        return result;
    }

    function biFromHex(s) {
        var result = new BigInt();
        var sl = s.length;
        for (var i = sl, j = 0; i > 0; i -= 4,
        ++j) {
            result.digits[j] = hexToDigit(s.substr(Math.max(i - 4, 0), Math.min(i, 4)));
        }
        return result;
    }

    function biFromString(s, radix) {
        var isNeg = s.charAt(0) == "-";
        var istop = isNeg ? 1 : 0;
        var result = new BigInt();
        var place = new BigInt();
        place.digits[0] = 1;
        // radix^0
        for (var i = s.length - 1; i >= istop; i--) {
            var c = s.charCodeAt(i);
            var digit = charToHex(c);
            var biDigit = biMultiplyDigit(place, digit);
            result = biAdd(result, biDigit);
            place = biMultiplyDigit(place, radix);
        }
        result.isNeg = isNeg;
        return result;
    }

    function biDump(b) {
        return (b.isNeg ? "-" : "") + b.digits.join(" ");
    }

    function biAdd(x, y) {
        var result;

        if (x.isNeg != y.isNeg) {
            y.isNeg = !y.isNeg;
            result = biSubtract(x, y);
            y.isNeg = !y.isNeg;
        } else {
            result = new BigInt();
            var c = 0;
            var n;
            for (var i = 0; i < x.digits.length; ++i) {
                n = x.digits[i] + y.digits[i] + c;
                result.digits[i] = n % biRadix;
                c = Number(n >= biRadix);
            }
            result.isNeg = x.isNeg;
        }
        return result;
    }

    function biSubtract(x, y) {
        var result;
        if (x.isNeg != y.isNeg) {
            y.isNeg = !y.isNeg;
            result = biAdd(x, y);
            y.isNeg = !y.isNeg;
        } else {
            result = new BigInt();
            var n, c;
            c = 0;
            for (var i = 0; i < x.digits.length; ++i) {
                n = x.digits[i] - y.digits[i] + c;
                result.digits[i] = n % biRadix;
                // Stupid non-conforming modulus operation.
                if (result.digits[i] < 0)
                    result.digits[i] += biRadix;
                c = 0 - Number(n < 0);
            }
            // Fix up the negative sign, if any.
            if (c == -1) {
                c = 0;
                for (var i = 0; i < x.digits.length; ++i) {
                    n = 0 - result.digits[i] + c;
                    result.digits[i] = n % biRadix;
                    // Stupid non-conforming modulus operation.
                    if (result.digits[i] < 0)
                        result.digits[i] += biRadix;
                    c = 0 - Number(n < 0);
                }
                // Result is opposite sign of arguments.
                result.isNeg = !x.isNeg;
            } else {
                // Result is same sign.
                result.isNeg = x.isNeg;
            }
        }
        return result;
    }

    function biHighIndex(x) {
        var result = x.digits.length - 1;
        while (result > 0 && x.digits[result] == 0)
            --result;
        return result;
    }

    function biNumBits(x) {
        var n = biHighIndex(x);
        var d = x.digits[n];
        var m = (n + 1) * bitsPerDigit;
        var result;
        for (result = m; result > m - bitsPerDigit; --result) {
            if ((d & 0x8000) != 0)
                break;
            d <<= 1;
        }
        return result;
    }

    function biMultiply(x, y) {
        var result = new BigInt();
        var c;
        var n = biHighIndex(x);
        var t = biHighIndex(y);
        var u, uv, k;

        for (var i = 0; i <= t; ++i) {
            c = 0;
            k = i;
            for (j = 0; j <= n; ++j,
            ++k) {
                uv = result.digits[k] + x.digits[j] * y.digits[i] + c;
                result.digits[k] = uv & maxDigitVal;
                c = uv >>> biRadixBits;
                //c = Math.floor(uv / biRadix);
            }
            result.digits[i + n + 1] = c;
        }
        // Someone give me a logical xor, please.
        result.isNeg = x.isNeg != y.isNeg;
        return result;
    }

    function biMultiplyDigit(x, y) {
        var n, c, uv;

        result = new BigInt();
        n = biHighIndex(x);
        c = 0;
        for (var j = 0; j <= n; ++j) {
            uv = result.digits[j] + x.digits[j] * y + c;
            result.digits[j] = uv & maxDigitVal;
            c = uv >>> biRadixBits;
            //c = Math.floor(uv / biRadix);
        }
        result.digits[1 + n] = c;
        return result;
    }

    function arrayCopy(src, srcStart, dest, destStart, n) {
        var m = Math.min(srcStart + n, src.length);
        for (var i = srcStart, j = destStart; i < m; ++i,
        ++j) {
            dest[j] = src[i];
        }
    }

    var highBitMasks = new Array(0x0000,0x8000,0xc000,0xe000,0xf000,0xf800,0xfc00,0xfe00,0xff00,0xff80,0xffc0,0xffe0,0xfff0,0xfff8,0xfffc,0xfffe,0xffff);

    function biShiftLeft(x, n) {
        var digitCount = Math.floor(n / bitsPerDigit);
        var result = new BigInt();
        arrayCopy(x.digits, 0, result.digits, digitCount, result.digits.length - digitCount);
        var bits = n % bitsPerDigit;
        var rightBits = bitsPerDigit - bits;
        for (var i = result.digits.length - 1, i1 = i - 1; i > 0; --i,
        --i1) {
            result.digits[i] = ((result.digits[i] << bits) & maxDigitVal) | ((result.digits[i1] & highBitMasks[bits]) >>> rightBits);
        }
        result.digits[0] = (result.digits[i] << bits) & maxDigitVal;
        result.isNeg = x.isNeg;
        return result;
    }

    var lowBitMasks = new Array(0x0000,0x0001,0x0003,0x0007,0x000f,0x001f,0x003f,0x007f,0x00ff,0x01ff,0x03ff,0x07ff,0x0fff,0x1fff,0x3fff,0x7fff,0xffff);

    function biShiftRight(x, n) {
        var digitCount = Math.floor(n / bitsPerDigit);
        var result = new BigInt();
        arrayCopy(x.digits, digitCount, result.digits, 0, x.digits.length - digitCount);
        var bits = n % bitsPerDigit;
        var leftBits = bitsPerDigit - bits;
        for (var i = 0, i1 = i + 1; i < result.digits.length - 1; ++i,
        ++i1) {
            result.digits[i] = (result.digits[i] >>> bits) | ((result.digits[i1] & lowBitMasks[bits]) << leftBits);
        }
        result.digits[result.digits.length - 1] >>>= bits;
        result.isNeg = x.isNeg;
        return result;
    }

    function biMultiplyByRadixPower(x, n) {
        var result = new BigInt();
        arrayCopy(x.digits, 0, result.digits, n, result.digits.length - n);
        return result;
    }

    function biDivideByRadixPower(x, n) {
        var result = new BigInt();
        arrayCopy(x.digits, n, result.digits, 0, result.digits.length - n);
        return result;
    }

    function biModuloByRadixPower(x, n) {
        var result = new BigInt();
        arrayCopy(x.digits, 0, result.digits, 0, n);
        return result;
    }

    function biCompare(x, y) {
        if (x.isNeg != y.isNeg) {
            return 1 - 2 * Number(x.isNeg);
        }
        for (var i = x.digits.length - 1; i >= 0; --i) {
            if (x.digits[i] != y.digits[i]) {
                if (x.isNeg) {
                    return 1 - 2 * Number(x.digits[i] > y.digits[i]);
                } else {
                    return 1 - 2 * Number(x.digits[i] < y.digits[i]);
                }
            }
        }
        return 0;
    }

    function biDivideModulo(x, y) {
        var nb = biNumBits(x);
        var tb = biNumBits(y);
        var origYIsNeg = y.isNeg;
        var q, r;
        if (nb < tb) {
            // |x| < |y|
            if (x.isNeg) {
                q = biCopy(bigOne);
                q.isNeg = !y.isNeg;
                x.isNeg = false;
                y.isNeg = false;
                r = biSubtract(y, x);
                // Restore signs, 'cause they're references.
                x.isNeg = true;
                y.isNeg = origYIsNeg;
            } else {
                q = new BigInt();
                r = biCopy(x);
            }
            return new Array(q,r);
        }

        q = new BigInt();
        r = x;

        // Normalize Y.
        var t = Math.ceil(tb / bitsPerDigit) - 1;
        var lambda = 0;
        while (y.digits[t] < biHalfRadix) {
            y = biShiftLeft(y, 1);
            ++lambda;
            ++tb;
            t = Math.ceil(tb / bitsPerDigit) - 1;
        }
        // Shift r over to keep the quotient constant. We'll shift the
        // remainder back at the end.
        r = biShiftLeft(r, lambda);
        nb += lambda;
        // Update the bit count for x.
        var n = Math.ceil(nb / bitsPerDigit) - 1;

        var b = biMultiplyByRadixPower(y, n - t);
        while (biCompare(r, b) != -1) {
            ++q.digits[n - t];
            r = biSubtract(r, b);
        }
        for (var i = n; i > t; --i) {
            var ri = i >= r.digits.length ? 0 : r.digits[i];
            var ri1 = i - 1 >= r.digits.length ? 0 : r.digits[i - 1];
            var ri2 = i - 2 >= r.digits.length ? 0 : r.digits[i - 2];
            var yt = t >= y.digits.length ? 0 : y.digits[t];
            var yt1 = t - 1 >= y.digits.length ? 0 : y.digits[t - 1];
            if (ri == yt) {
                q.digits[i - t - 1] = maxDigitVal;
            } else {
                q.digits[i - t - 1] = Math.floor((ri * biRadix + ri1) / yt);
            }

            var c1 = q.digits[i - t - 1] * (yt * biRadix + yt1);
            var c2 = ri * biRadixSquared + (ri1 * biRadix + ri2);
            while (c1 > c2) {
                --q.digits[i - t - 1];
                c1 = q.digits[i - t - 1] * ((yt * biRadix) | yt1);
                c2 = ri * biRadix * biRadix + (ri1 * biRadix + ri2);
            }

            b = biMultiplyByRadixPower(y, i - t - 1);
            r = biSubtract(r, biMultiplyDigit(b, q.digits[i - t - 1]));
            if (r.isNeg) {
                r = biAdd(r, b);
                --q.digits[i - t - 1];
            }
        }
        r = biShiftRight(r, lambda);
        // Fiddle with the signs and stuff to make sure that 0 <= r < y.
        q.isNeg = x.isNeg != origYIsNeg;
        if (x.isNeg) {
            if (origYIsNeg) {
                q = biAdd(q, bigOne);
            } else {
                q = biSubtract(q, bigOne);
            }
            y = biShiftRight(y, lambda);
            r = biSubtract(y, r);
        }
        // Check for the unbelievably stupid degenerate case of r == -0.
        if (r.digits[0] == 0 && biHighIndex(r) == 0)
            r.isNeg = false;

        return new Array(q,r);
    }

    function biDivide(x, y) {
        return biDivideModulo(x, y)[0];
    }

    function biModulo(x, y) {
        return biDivideModulo(x, y)[1];
    }

    function biMultiplyMod(x, y, m) {
        return biModulo(biMultiply(x, y), m);
    }

    function biPow(x, y) {
        var result = bigOne;
        var a = x;
        while (true) {
            if ((y & 1) != 0)
                result = biMultiply(result, a);
            y >>= 1;
            if (y == 0)
                break;
            a = biMultiply(a, a);
        }
        return result;
    }

    function biPowMod(x, y, m) {
        var result = bigOne;
        var a = x;
        var k = y;
        while (true) {
            if ((k.digits[0] & 1) != 0)
                result = biMultiplyMod(result, a, m);
            k = biShiftRight(k, 1);
            if (k.digits[0] == 0 && biHighIndex(k) == 0)
                break;
            a = biMultiplyMod(a, a, m);
        }
        return result;
    }

    /* pc键盘依赖 Barrett */

    // BarrettMu, a class for performing Barrett modular reduction computations in
    // JavaScript.
    //
    // Requires BigInt.js.
    //
    // Copyright 2004-2005 David Shapiro.
    //
    // You may use, re-use, abuse, copy, and modify this code to your liking, but
    // please keep this header.
    //
    // Thanks!
    //
    // Dave Shapiro
    // dave@ohdave.com

    function BarrettMu(m) {
        this.modulus = biCopy(m);
        this.k = biHighIndex(this.modulus) + 1;
        var b2k = new BigInt();
        b2k.digits[2 * this.k] = 1;
        // b2k = b^(2k)
        this.mu = biDivide(b2k, this.modulus);
        this.bkplus1 = new BigInt();
        this.bkplus1.digits[this.k + 1] = 1;
        // bkplus1 = b^(k+1)
        this.modulo = BarrettMu_modulo;
        this.multiplyMod = BarrettMu_multiplyMod;
        this.powMod = BarrettMu_powMod;
    }

    function BarrettMu_modulo(x) {
        var q1 = biDivideByRadixPower(x, this.k - 1);
        var q2 = biMultiply(q1, this.mu);
        var q3 = biDivideByRadixPower(q2, this.k + 1);
        var r1 = biModuloByRadixPower(x, this.k + 1);
        var r2term = biMultiply(q3, this.modulus);
        var r2 = biModuloByRadixPower(r2term, this.k + 1);
        var r = biSubtract(r1, r2);
        if (r.isNeg) {
            r = biAdd(r, this.bkplus1);
        }
        var rgtem = biCompare(r, this.modulus) >= 0;
        while (rgtem) {
            r = biSubtract(r, this.modulus);
            rgtem = biCompare(r, this.modulus) >= 0;
        }
        return r;
    }

    function BarrettMu_multiplyMod(x, y) {
        /*
	x = this.modulo(x);
	y = this.modulo(y);
	*/
        var xy = biMultiply(x, y);
        return this.modulo(xy);
    }

    function BarrettMu_powMod(x, y) {
        var result = new BigInt();
        result.digits[0] = 1;
        var a = x;
        var k = y;
        while (true) {
            if ((k.digits[0] & 1) != 0)
                result = this.multiplyMod(result, a);
            k = biShiftRight(k, 1);
            if (k.digits[0] == 0 && biHighIndex(k) == 0)
                break;
            a = this.multiplyMod(a, a);
        }
        return result;
    }

    /* pc键盘加密依赖 RSA.js */

    // RSA, a suite of routines for performing RSA public-key computations in
    // JavaScript.
    //
    // Requires BigInt.js and Barrett.js.
    //
    // Copyright 1998-2005 David Shapiro.
    //
    // You may use, re-use, abuse, copy, and modify this code to your liking, but
    // please keep this header.
    //
    // Thanks!
    //
    // Dave Shapiro
    // dave@ohdave.com

    function RSAKeyPair(encryptionExponent, decryptionExponent, modulus) {
        this.e = biFromHex(encryptionExponent);
        this.d = biFromHex(decryptionExponent);
        this.m = biFromHex(modulus);
        // We can do two bytes per digit, so
        // chunkSize = 2 * (number of digits in modulus - 1).
        // Since biHighIndex returns the high index, not the number of digits, 1 has
        // already been subtracted.
        this.chunkSize = 2 * biHighIndex(this.m);
        this.radix = 16;
        this.barrett = new BarrettMu(this.m);
    }

    function twoDigit(n) {
        return (n < 10 ? "0" : "") + String(n);
    }

    function encryptedString(key, s) {
        // Altered by Rob Saunders (rob@robsaunders.net). New routine pads the
        // string after it has been converted to an array. This fixes an
        // incompatibility with Flash MX's ActionScript.
        var a = new Array();
        var sl = s.length;
        var i = 0;
        while (i < sl) {
            a[i] = s.charCodeAt(i);
            i++;
        }

        while (a.length % key.chunkSize != 0) {
            a[i++] = 0;
        }

        var al = a.length;
        var result = "";
        var j, k, block;
        for (i = 0; i < al; i += key.chunkSize) {
            block = new BigInt();
            j = 0;
            for (k = i; k < i + key.chunkSize; ++j) {
                block.digits[j] = a[k++];
                block.digits[j] += a[k++] << 8;
            }
            var crypt = key.barrett.powMod(block, key.e);
            var text = key.radix == 16 ? biToHex(crypt) : biToString(crypt, key.radix);
            result += text + " ";
        }
        return result.substring(0, result.length - 1);
        // Remove last space.
    }

    function decryptedString(key, s) {
        var blocks = s.split(" ");
        var result = "";
        var i, j, block;
        for (i = 0; i < blocks.length; ++i) {
            var bi;
            if (key.radix == 16) {
                bi = biFromHex(blocks[i]);
            } else {
                bi = biFromString(blocks[i], key.radix);
            }
            block = key.barrett.powMod(bi, key.d);
            for (j = 0; j <= biHighIndex(block); ++j) {
                result += String.fromCharCode(block.digits[j] & 255, block.digits[j] >> 8);
            }
        }
        // Remove trailing null, if any.
        if (result.charCodeAt(result.length - 1) == 0) {
            result = result.substring(0, result.length - 1);
        }
        return result;
    }

    var isReady = false;
    var xRepeat = 0;

    var componentConfig = {
        keyboardPCTpl: '<div class="security-keyboardPC-panel" onselectstart="return!1"><div class="key-top"><label>安全键盘</label><span class="caps-lock">切换大/小写</span></div><div class="key-con"><ul></ul></div></div>',
        inputBoxSelector: ".security-keyboardPC-input-box",
        inputBoxInnerClass: "security-keyboardPC-input-box-inner",
        keyboardPCPanelSelector: 'security-keyboard-wrapper',
        keyboardPCPanelClass: 'security-keyboardPC-panel',
        inputFocusClass: "focus",
        keyActiveClass: "active"
    };

    var defaultOptions = {
        sendDrawInfoUrl: "sendDrawInfo",
        pattern: "PC",

        // spaceKeyValue: "",
        nameAttr: "data-name",
        valueAttr: "data-value",
        defaultType: "default",
        sourceNameAttr: "data-source-name",
        defaultSourceName: "default",
        placeholderAttr: "data-placeholder",
        maxlengthAttr: "data-maxlength",
        keyValueAttr: "data-value",
        onDataLoadError: function(xhr, status, err, options) {},
        beforeOpen: function() {
            return true;
        },
        afterOpen: function() {
            $(document).trigger("keyboardPCOpen");
        },
        beforeClose: function() {
            return true;
        },
        afterClose: function() {
            $(document).trigger("keyboardPCClose");
        },
        onToggleCase: function() {

        },
        beforeInput: function(value) {
            return true;
        },
        onTargetChange: function(oldTarget, newTarget) {
          // $(document).trigger("keyboardPCTargetChange");
        },
        onInput: function() {
            // $(status.target).trigger("keyboardPCInput");
        },
        onDelete: function() {
            // $(status.target).trigger("keyboardPCDelete");
        },
        onComplete: function() {
            $(status.target).trigger("keyboardPCComplete");
            action.close();
        }
    };

    var dataInfo = {}, 
        sourceInfo = {}, 
        status = {}, 
        opts = $.extend({}, defaultOptions), 
        $keyboardPC = $(componentConfig.keyboardPCTpl),
        tapTarget;

    $keyboardPC.on("click.keyboard", function(e) {
        e.preventDefault();
        $(e.target).trigger("keyboardPCClick");
    });

    function setKeyboardPC(sourceName) {
        if (!dataInfo[sourceName]) {
            try {
                console.error("安全键盘数据源“" + sourceName + "”获取失败");
            } catch (e) {}
        }
        //图片拼接到键盘
        for (var i = 0; i < 97; i++) {
            if (i < 95) {
                if (i < 10) {
                    $(".security-keyboardPC-panel .key-con ul").append('<li class="pc-number-letter pc-key-char" data-value=' + i + '><span class="pc-key-char-inner"></span></li>');
                } else if (i >= 10 && i < 36) {
                    $(".security-keyboardPC-panel .key-con ul").append('<li class="pc-lowercase-letter pc-key-char" data-value=' + i + '><span class="pc-key-char-inner"></span></li>');
                } else if (i >= 36 && i < 62) {
                    $(".security-keyboardPC-panel .key-con ul").append('<li class="pc-uppercase-letter pc-key-char" data-value=' + i + '><span class="pc-key-char-inner"></span></li>');
                } else if (i >= 62 && i < 95) {
                    $(".security-keyboardPC-panel .key-con ul").append('<li class="pc-mark-letter pc-key-char" data-value=' + i + ' ><span class="pc-key-char-inner"></span></li>');
                }
                $(".security-keyboardPC-panel .key-con ul").find("li span").eq(i).css({
                    "background-position": xRepeat + "px 0px"
                });
                xRepeat -= 16;
            } else if (i == 95) {
                $(".security-keyboardPC-panel .key-con ul").append('<li class="pc-certain-btn"><a href="javascript:;">确定</a></li>');
            } else if (i == 96) {
                $(".security-keyboardPC-panel .key-con ul").append('<li class="pc-delete-btn"><a href="javascript:;">删除</a></li>');
            }
        }
        $(".security-keyboardPC-panel .key-con ul li .pc-key-char-inner").css({
          "background-image": "url(" + dataInfo[sourceName].imageUrl + ")"
        });
        $(".security-keyboardPC-panel .key-con ul").find(".pc-key-char").hover(function() {
            if ($(this).find("span").length != 0) {
                var spanPosition = $(this).find(".pc-key-char-inner").css("background-position");
                spanPosition = spanPosition.split(" ");
                //转换为数组
                spanPosition[1] = "-16px";
                spanPosition = spanPosition.join(" ");
                $(this).find("span").css("background-position", spanPosition);
            }
        }, function() {
            if ($(this).find(".pc-key-char-inner").length != 0) {
                var spanPosition = $(this).find(".pc-key-char-inner").css("background-position");
                spanPosition = spanPosition.split(" ");
                //转换为数组
                spanPosition[1] = "0";
                spanPosition = spanPosition.join(" ");
                $(this).find(".pc-key-char-inner").css("background-position", spanPosition);
            }
        });
        $(".security-keyboardPC-panel .key-top span").hover(function() {
            $(this).css({
                background: "#519dda",
                color: "#fff"
            });
        }, function() {
            $(this).css({
                background: "#fff",
                color: "#519dda"
            });
        });

        $(".security-keyboardPC-panel .key-con ul li").hover(function() {
            $(this).css({
                "background-position": "0px -20px;"
            });
        }, function() {
            $(this).css({
                "background-position": "0px 0px;"
            });
        });
    }

    // function bulidKeyboardPC(sourceName){
    //   if(dataInfo[sourceName]){
    //     setKeyboardPC(sourceName);
    //   }else{
    //     getData(sourceName, function(result){
    //         setKeyboardPC(sourceName);
    //     });
    //   }
    // }

    function getData(sourceName, imageUrl,callback) {
        var dataUrl = sourceName === opts.defaultSourceName ? opts.dataUrl : sourceInfo[sourceName];

        $.ajax({
            type: "post",
            url: dataUrl,
            dataType: "json",
            data: {
                method: opts.sendDrawInfoUrl,
                pattern: opts.pattern
            },
            cache: false,
            async: false,
            success: function(data) {

                dataInfo[sourceName] = {
                    imageUrl: data.imageUrl,
                    modulus: data.modulus,
                    exponent: data.exponent,
                    sessionId: data.sessionId
                };
                if(dataInfo[sourceName].imageUrl === ""){
                  dataInfo[sourceName].imageUrl = imageUrl;
                }
                typeof callback === "function" && callback(data);
            },
            error: function(xhr, status, err) {
                typeof opts.onDataLoadError === "function" && opts.onDataLoadError(xhr, status, err, this);
            }
        });
    }

    function targetFocus(target) {
        if (!target) {
            return;
        }
        var $target = $(target)
          , value = $target.attr(opts.valueAttr) || "";
        if (value === "") {
            $target.html('<div class="' + componentConfig.inputBoxInnerClass + '"><span></span></div>');
        }
        $target.addClass(componentConfig.inputFocusClass).trigger("keyboardPCFocus");
    }

    function targetBlur(target) {
        if (!target) {
            return;
        }
        var $target = $(target)
          , value = $target.attr(opts.valueAttr) || ""
          , placeholder = $target.attr(opts.placeholderAttr) || "";
        valueLength = value === "" ? 0 : value.split(",").length;
        if (valueLength === 0) {
            $target.html(placeholder);
        }
        $target.removeClass(componentConfig.inputFocusClass).trigger("keyboardPCBlur");
    }

    function addValue(value) {
        if (value === "" || typeof value !== "string") {
            return;
        }
        var $target = $(status.target), 
            maxlength = parseInt($target.attr(opts.maxlengthAttr)), 
            oldValue = $target.attr(opts.valueAttr) || "", 
            oldValueArr, 
            isMax = false;
        if (typeof opts.beforeInput === "function" && !opts.beforeInput(value)) {
            return;
        }
        oldValueArr = oldValue === "" ? [] : oldValue.split(",");
        if (!isNaN(maxlength) && maxlength > 0) {
            if (oldValueArr.length >= maxlength) {
                typeof opts.onInput === "function" && opts.onInput();
                $target.trigger("keyboardPCInput");
                $target.trigger("keyboardPCMax");
                return;
            } else if (oldValueArr.length === maxlength - 1) {
                isMax = true;
            }
        }
        oldValueArr.push(value);
        $target.attr(opts.valueAttr, oldValueArr.join(",")).find("." + componentConfig.inputBoxInnerClass).append("<b></b>");
        typeof opts.onInput === "function" && opts.onInput();
        $target.trigger("keyboardPCInput");
        isMax && $target.trigger("keyboardPCMax");
    }

    function delValue() {
        var $target = $(status.target), oldValue = $target.attr(opts.valueAttr) || "", oldValueArr;
        if (oldValue !== "") {
            oldValueArr = oldValue.split(",");
            oldValueArr.pop();
            $target.attr(opts.valueAttr, oldValueArr.join(","));
            $target.find("." + componentConfig.inputBoxInnerClass).find("b").last().remove();
        }
        typeof opts.onInput === "function" && opts.onInput();
        typeof opts.onDelete === "function" && opts.onDelete();
        $target.trigger("keyboardPCInput");
        $target.trigger("keyboardPCDelete");
    }

    function encode(str, exponent, modulus){
      var n = str.length / 50,
          arr = [],
          key,
          i;
      setMaxDigits(130);
      key = new RSAKeyPair(exponent, '', modulus);
      for(i=0;i<n;i++){
          arr.push(encryptedString(key, encodeURIComponent(str.substring(50*i,50*(i+1)))));
      }
      return arr.join(':');
    }

    var action = {
        addSource: function(srcName, srcUrl, imageUrl) {
            if (sourceInfo[srcName]) {
                try {
                    console.warn("已存在一个同名的数据源");
                } catch (e) {}
                return;
            }
            sourceInfo[srcName] = srcUrl;
            getData(srcName, imageUrl,function(result) {
                if (!isReady) {
                    $("body").append($keyboardPC);
                    isReady = true;
                }
                setKeyboardPC(srcName, imageUrl);
            });
        },

        open: function(target, callback) {
            var _this = this
              , oldTarget = status.target
              , newTarget = $(target)[0];

            if (typeof opts.beforeOpen === "function" && !opts.beforeOpen()) {
                return;
            }

            if (!newTarget) {
                try {
                    console.error("未指定目标输入框！");
                } catch (e) {}
                return;
            }
            // 目标状态处理
            if (newTarget !== oldTarget) {
                status.target = newTarget;
                targetBlur(oldTarget);
                targetFocus(newTarget);
                var _thisTop = $(newTarget).offset().top;
                var _thisLeft = $(newTarget).offset().left;
                var _thisHeight = $(newTarget).height();
                var _thisPaddingT = parseInt($(newTarget).css("padding-top"));
                $keyboardPC.css({
                    left: _thisLeft + "px",
                    top: _thisTop + _thisHeight + _thisPaddingT + "px"
                });
            }
            // 关闭原生键盘
            $("input:focus, textarea:focus").blur();
            // 打开键盘
            if (!status.isOpened) {
                status.isOpened = true;
                if (newTarget !== oldTarget) {
                    typeof opts.onTargetChange === "function" && opts.onTargetChange(oldTarget, newTarget);
                }
                typeof callback === "function" && callback();
                $keyboardPC.addClass("keyboardPC-open");
            } else {
                typeof callback === "function" && callback();
            }
        },

        close: function(callback) {
            if (typeof opts.beforeClose === "function" && !opts.beforeClose()) {
                return;
            }
            targetBlur(status.target);
            status.target = null;
            if (status.isOpened) {
                $keyboardPC.removeClass("keyboardPC-open");
                status.isOpened = false;
                typeof opts.afterClose === "function" && opts.afterClose();
                typeof callback === "function" && callback();
            } else {
                typeof callback === "function" && callback();
            }
        },

        cleanInputBox: function(element) {
          var s = element === undefined ? componentConfig.inputBoxSelector : element;
          $(s).each(function(){
              var $this = $(this),
                  placeholder = $this.attr(opts.placeholderAttr) || '';
              if($this.is(componentConfig.inputBoxSelector)){
                  if($this[0] === status.target){
                      $this.html('<div class="'+ componentConfig.inputBoxInnerClass +'"></div>');
                  }else{
                      $this.html(placeholder);
                  }
                  $this.attr(opts.valueAttr, '');
              }
          });
        },

        // 密码输入相等校验
        // matchInputValue: function(element1, element2) {
        //   var valueEle1 = $(element1).attr(valueAttr);
        //   var valueEle2 = $(element1).attr(valueAttr);
        // },
        
        getParamsBySourceName: function(sourceName){
          if(typeof sourceName === 'string' && sourceName !== '' && dataInfo[sourceName]){
              return {
                  exponent: dataInfo[sourceName].exponent,
                  modulus: dataInfo[sourceName].modulus,
                  sessionId: dataInfo[sourceName].sessionId
              };
          }else{
              return null;
          }
        },
        // 以sourceName名加密
        encodeValueBySourceName: function(sourceName){
          var arr = [];
          if(typeof sourceName === 'string' && sourceName !== '' && dataInfo[sourceName]){
              // arr.push(dataInfo[sourceName].offset.join());
              $(componentConfig.inputBoxSelector+'['+ opts.sourceNameAttr +'='+ sourceName +']').each(function(index){
                  var $input = $(this);
                  arr.push(JSON.stringify({
                      // dataType: $input.attr(opts.typeAttr) || opts.defaultType,
                      name: $input.attr(opts.nameAttr) || 'pwdParamter',
                      value: $input.attr(opts.valueAttr) || '',
                  }));
              });
              return encode(arr.join(';'), dataInfo[sourceName].exponent, dataInfo[sourceName].modulus);
          }else{
              return '';
          }
        },
        // 以css 选择器加密
        encodeValueByInputBox: function(inputBox){
          var arr = [],
              sourceName,
              $input = $(inputBox);
          if($input.is(componentConfig.inputBoxSelector)){
              sourceName = $input.attr(opts.sourceNameAttr) || opts.defaultSourceName;
              arr.push(JSON.stringify({
                  name: $input.attr(opts.nameAttr) || 'pwdParamter',
                  value: $input.attr(opts.valueAttr) || '',
              }));
              return encode(arr.join(';'), dataInfo[sourceName].exponent, dataInfo[sourceName].modulus);
          }else{
              return '';
          }
      }

    };

    $keyboardPC.on("keyboardPCClick", ".caps-lock", function() {
        if ($(this).hasClass("active")) {
            $(".pc-uppercase-letter").hide();
            $(".pc-lowercase-letter").show();
        } else {
            $(".pc-lowercase-letter").hide();
            $(".pc-uppercase-letter").show();
        }
        $(this).toggleClass("active");
        $(status.target).trigger("keyboardPCToggleCase");

    });

    $keyboardPC.on("keyboardPCClick", ".pc-certain-btn", function() {
        typeof opts.onComplete === "function" && opts.onComplete();
    });

    $keyboardPC.on("keyboardPCClick", ".pc-delete-btn", function() {
        delValue();
    });

    $keyboardPC.on("keyboardPCClick", ".pc-key-char", function() {
        var value = $(this).attr(opts.keyValueAttr) || "";
        addValue(value);
    });

    $(document).on("click", function(e) {
        var input, $target = $(e.target), $parentInput = $target.closest(componentConfig.inputBoxSelector);
        if ($target.is(componentConfig.inputBoxSelector)) {
            input = e.target;
        } else if ($parentInput.length > 0) {
            input = $parentInput[0];
        }
        if (input) {
            if ($(input).is("input") || $(input).is("textarea")) {
                try {
                    console.warn("目标不能是原生的输入框或文本域！");
                } catch (e) {}
                return;
            }
            action.open(input);
        } else {
            if ($target.is('.' + componentConfig.keyboardPCPanelClass) || $target.parents('.' + componentConfig.keyboardPCPanelClass).length > 0 || $target.is(componentConfig.inputBoxSelector) || $target.parents(componentConfig.inputBoxSelector).length > 0) {
            } else {
                if (status.isOpened) {
                    action.close();
                }
            }
        }
    });

    return action;
});
