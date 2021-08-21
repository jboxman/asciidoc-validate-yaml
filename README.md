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

## Usage

The help output describes the available options.

```
Usage: asciidoc-validate-yaml [options]

Validate YAML listing blocks in Asciidoc files

Options:
  -a, --attributes [attributes...]  Optional: Attributes such as product-version=1
  --pass                            Always succeed regardless of any validation failures (default: false)
  --stdin                           Read file list from stdin instead of _topic_map.yml (default: false)
  --topic <path>                    Optional: Path to ascii_binder _topic_map.yml file
  -h, --help                        display help for command
```

## Alternatives

You can use the AsciiDoc `include` directive to include YAML files instead of including
YAML content directly in an AsciiDoc file. In such cases, you can validate the YAML
directly without having to parse the AsciiDoc first.

## Known issues

For known issues, refer to [GitHub](https://github.com/jboxman/asciidoc-validate-yaml/issues).
