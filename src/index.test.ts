import { describe, it, expect, beforeEach } from 'vitest'
import NamespacedMap from '.'

describe('namespaced map', () => {
  let map: NamespacedMap<'primaryId' | 'secondaryId'>
  const compositeKey1 = {
    primaryId: 1,
    secondaryId: '1',
  }
  const value1 = {
    secret: 'hello',
  }

  const compositeKey2 = {
    primaryId: 2,
    secondaryId: '2',
  }
  const value2 = {
    secret: 'world',
  }

  beforeEach(() => {
    map = new NamespacedMap<'primaryId' | 'secondaryId'>()
  })

  describe('clear()', () => {
    beforeEach(() => {
      map.set(compositeKey1, value1)
      map.set(compositeKey2, value2)
    })

    it('removes all added elements from map', () => {
      map.clear()

      expect(map.size).toEqual(0)

      expect(map.has('primaryId', compositeKey1.primaryId)).toEqual(false)
      expect(map.has('secondaryId', compositeKey1.secondaryId)).toEqual(false)

      expect(map.has('primaryId', compositeKey2.primaryId)).toEqual(false)
      expect(map.has('secondaryId', compositeKey2.secondaryId)).toEqual(false)
    })
  })

  describe('set()', () => {
    describe('setting with overlapping composite keys', () => {
      it('consolidates overlapping keys', () => {
        const overlappingCompositeKey = {
          primaryId: compositeKey1.primaryId + 1,
          secondaryId: compositeKey1.secondaryId,
        }

        map.set(compositeKey1, value1)
        map.set(overlappingCompositeKey, value2)

        expect(map.size).toEqual(1)

        expect(map.get('primaryId', overlappingCompositeKey.primaryId)).toEqual(value2)
        expect(map.get('secondaryId', overlappingCompositeKey.secondaryId)).toEqual(value2)
      })
    })

    describe('setting with different keys but the same value (non-injective map)', () => {
      it('retains non-injective elements', () => {
        map.set(compositeKey1, value1)
        map.set(compositeKey2, value1)

        expect(map.size).toEqual(2)

        expect(map.get('primaryId', compositeKey1.primaryId)).toEqual(value1)
        expect(map.get('secondaryId', compositeKey1.secondaryId)).toEqual(value1)

        expect(map.get('primaryId', compositeKey2.primaryId)).toEqual(value1)
        expect(map.get('secondaryId', compositeKey2.secondaryId)).toEqual(value1)
      })
    })

    describe('re-setting identical key-value pair', () => {
      it('maintains map size', () => {
        map.set(compositeKey1, value1)
        map.set(compositeKey1, value1)

        expect(map.get('primaryId', compositeKey1.primaryId)).toEqual(value1)
        expect(map.get('secondaryId', compositeKey1.secondaryId)).toEqual(value1)

        expect(map.size).toEqual(1)
      })
    })
  })
})
