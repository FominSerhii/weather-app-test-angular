import { parseCities } from './parse-cities';

describe('parseCities', () => {
    it('splits and trims comma-separated city names', () => {
        expect(parseCities(' Bratislava, Trnava , Vienna ')).toEqual([
            'Bratislava',
            'Trnava',
            'Vienna',
        ]);
    });

    it('ignores empty entries and case-insensitive duplicates', () => {
        expect(parseCities('Vienna,, vienna, Prague, ')).toEqual([
            'Vienna',
            'Prague',
        ]);
    });

    it('returns an empty list for blank input', () => {
        expect(parseCities(' , , ')).toEqual([]);
    });
});