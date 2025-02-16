class NamespacedMap<T extends string = string, V = any> {
  private namespaceToKeyToNormalizedKey: Partial<Record<T, Map<PropertyKey, string>>>
  private normalizedKeyToValue: Map<
    string,
    {
      value: V
      namespaceToKey: Record<T, PropertyKey>
    }
  >

  constructor() {
    this.normalizedKeyToValue = new Map()
    this.namespaceToKeyToNormalizedKey = {}
  }

  get(namespace: T, key: PropertyKey): V | undefined {
    const normalizedKey = this.namespaceToKeyToNormalizedKey[namespace]?.get(key)
    if (!normalizedKey) return

    return this.normalizedKeyToValue.get(normalizedKey)?.value
  }

  has(namespace: T, key: PropertyKey): boolean {
    return this.namespaceToKeyToNormalizedKey[namespace]?.has(key) ?? false
  }

  set(namespaceToKey: Record<T, PropertyKey>, value: V): NamespacedMap {
    const uuid = crypto.randomUUID()

    for (const [namespace, key] of Object.entries(namespaceToKey)) {
      const keyToNormalizedKey =
        this.namespaceToKeyToNormalizedKey[namespace as T] ?? new Map<PropertyKey, string>()

      const existingNormalizedKey = keyToNormalizedKey.get(key as PropertyKey)
      if (existingNormalizedKey) this.deleteNormalizedKeyWithNamespaceKeys(existingNormalizedKey)

      keyToNormalizedKey.set(key as PropertyKey, uuid)
      this.namespaceToKeyToNormalizedKey[namespace as T] = keyToNormalizedKey
    }

    this.normalizedKeyToValue.set(uuid, { value, namespaceToKey })

    return this
  }

  delete(namespace: T, key: PropertyKey): boolean {
    const keyToNormalizedKey = this.namespaceToKeyToNormalizedKey[namespace]
    if (!keyToNormalizedKey) return false

    const normalizedKey = keyToNormalizedKey.get(key)
    if (!normalizedKey) return false

    const value = this.normalizedKeyToValue.get(normalizedKey)
    assertIsDefined(value)

    for (const [namespace, key] of Object.entries(value.namespaceToKey)) {
      const keyToNormalizedKey = this.namespaceToKeyToNormalizedKey[namespace as T]
      assertIsDefined(keyToNormalizedKey)

      keyToNormalizedKey.delete(key as PropertyKey)
    }

    this.normalizedKeyToValue.delete(normalizedKey)
    return true
  }

  clear() {
    this.namespaceToKeyToNormalizedKey = {}
    this.normalizedKeyToValue.clear()
  }

  get size(): number {
    return this.normalizedKeyToValue.size
  }

  private deleteNormalizedKeyWithNamespaceKeys(normalizedKey: string) {
    const existingValue = this.normalizedKeyToValue.get(normalizedKey)
    assertIsDefined(existingValue)

    for (const [namespace, key] of Object.entries(existingValue.namespaceToKey)) {
      const keyToNormalizedKey = this.namespaceToKeyToNormalizedKey[namespace as T]
      if (!keyToNormalizedKey) continue

      keyToNormalizedKey.delete(key as PropertyKey)
    }

    this.normalizedKeyToValue.delete(normalizedKey)
  }
}

function assertIsDefined<T>(input: T): asserts input is NonNullable<T> {
  if (input == null)
    throw new Error(`Internal library error: Expected input ${input} to be defined`)
}

export { NamespacedMap }
export default NamespacedMap
