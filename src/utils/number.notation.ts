export const notateNumber = (num: number): string => {
    let notation;
    let fraction;
    let temp;

    switch (true) {
        case num >= 1000 && num < 1_000_000:
            temp = num.toString().slice(0, -3);
            fraction = num.toString().slice(-3, -2);
            notation = temp + (+fraction ? ("." + fraction) : "") + " K"
            break;

        case num >= 1_000_000 && num < 1_000_000_000:
            temp = num.toString().slice(0, -6);
            fraction = num.toString().slice(-6, -5);
            notation = temp + (+fraction ? ("." + fraction) : "") + " M"
            break;

        case num >= 1_000_000_000 && num < 1_000_000_000_000:
            temp = num.toString().slice(0, -9);
            fraction = num.toString().slice(-9, -8);
            notation = temp + (+fraction ? ("." + fraction) : "") + " B"
            break;

        default:
            notation = num.toString();
            break;
    }

    return notation;
}

// console.log(notateNumber(999));              // "999"
// console.log(notateNumber(1000));             // "1 K"
// console.log(notateNumber(1500));             // "1.5 K"
// console.log(notateNumber(999_999));          // "999.9 K"
// console.log(notateNumber(1_000_000));        // "1 M"
// console.log(notateNumber(2_500_000));        // "2.5 M"
// console.log(notateNumber(999_999_999));      // "999.9 M"
// console.log(notateNumber(1_000_000_000));    // "1 B"
// console.log(notateNumber(5_700_000_000));    // "5.7 B"
// console.log(notateNumber(999_999_999_999));  // "999.9 B"
// console.log(notateNumber(1_000_000_000_000));// "1000 B"
