# Replacements

Replace devices.id & devices.interface with `deviceInterface` & `

Search

```
device:\n\s+id: (\S+)$\n\s\s((.*)(?=interface).*(?<=interface: )(\S+))
```

Replace

```
deviceId: $1\n$3deviceInterface: $4
```
