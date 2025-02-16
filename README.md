# namespaced-map

## Install

```bash
npm install namespaced-map
```

## Usage

```ts
const namespaceToKey = {
  key1: 'e3103528-bd5e-4a29-99f4-575785c43bb2',
  key2: 'd1dc7add-85e7-4804-a8df-1d3ae4e94166',
}
const value = {
  hello: 0,
  world: 1,
}

const map = new NamespacedMap()
map.set(namespaceToKey, value)

map.get('key1', namespaceToKey.key1)
// {
//  hello: 0,
//  world: 1,
// }
map.get('key2', namespaceToKey.key2)
// {
//  hello: 0,
//  world: 1,
// }

map.size
// 1
```

