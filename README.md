# asciidoc-validate-yaml

This tool validates the syntax of YAML in AsciiDoc files.

## Motivation

When writing documentation, it is vital that any YAML samples presented to a user are valid.
Because AsciiDoc is a structured, plain text documentation format, it is possible to extract and validate YAML.

## Requirements

Each YAML block must be placed within a listing block with `yaml` syntax highlighting.

```
[source,yaml]
----
key1:
- alpha
- delta
key2:
  key3: true
  key4: abc
----
```

Each YAML block can use call outs if necessary.

```
[source,yaml]
----
bigKey: some text <1>
----
<1> This describes the key
```

## Known issues

For known issues, refer to [GitHub](https://github.com/jboxman/asciidoc-validate-yaml/issues).
