var test = require('tape');
var fakeTime = require('timekeeper');

var RSSGenerator = require('./RSSGenerator');

const HOURS = 60 * 60;

test('getIdFromDateAndFrequency normal test', function(t) {
    t.plan(1);

    var startDate = new Date("Jan 1 2000");
    var frequency = 2 * HOURS;
    var fakeNow = new Date("Feb 1 2000");
    fakeTime.travel(fakeNow);

    var id = RSSGenerator.getIdFromDateAndFrequency(startDate, frequency);

    // There are 744 hours in 31 days, so 372 intervals of 2 hours
    var expected = 372;

    t.equal(id, expected);
});

test('getIdFromDateAndFrequency future time should throw', function(t) {
    t.plan(1);

    var startDate = new Date("Mar 1 2000");
    var frequency = 2 * HOURS;
    var fakeNow = new Date("Feb 1 2000");
    fakeTime.travel(fakeNow);

    t.throws(function() {
        RSSGenerator.getIdFromDateAndFrequency(startDate, frequency);
    })
});
