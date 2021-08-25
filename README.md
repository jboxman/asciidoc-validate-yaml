# asciidoc-validate-yaml

This tool validates the syntax of YAML in AsciiDoc files.

## Motivation

When writing documentation, it is vital that any YAML samples presented to a user are valid.
Because AsciiDoc is a structured, plain text documentation format, it is possible to extract and validate YAML.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) >= 10.x

Or you might want to install Node.js using [nvm](https://github.com/nvm-sh/nvm/blob/master/README.md) or some other version manager.

## Installation

To install the application, complete the following step:

- `npm i -g @jboxman/asciidoc-validate-yaml`

## Requirements

The YAML source must be placed within a listing block with `yaml` syntax highlighting.

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

For example, the following is the most common usage:

```
$ find . -type f -name '*.adoc' | asciidoc-validate-yaml --stdin
```

Example output:

```
Scanning .../networking/configuring-ipfailover.adoc
modules/nw-ipfailover-configuring-vrrp-preemption.adoc [18]: OK
modules/nw-ipfailover-configuring-more-than-254.adoc [28]: OK
modules/nw-ipfailover-configuration.adoc [40]: OK
modules/nw-ipfailover-configuring-check-notify-scripts.adoc [76]: OK
Scanning .../networking/multiple_networks/assigning-a-secondary-network-to-a-vrf.adoc
modules/cnf-assigning-a-secondary-network-to-a-vrf.adoc [39]: OK
Scanning .../networking/multiple_networks/edit-additional-network.adoc
Scanning .../networking/multiple_networks/configuring-multi-network-policy.adoc
modules/nw-multi-network-policy-differences.adoc [6]: OK
modules/nw-multi-network-policy-differences.adoc [16]: OK
```

## Alternatives

You can use the AsciiDoc `include` directive to include YAML files instead of including
YAML content directly in an AsciiDoc file. In such cases, you can validate the YAML
directly without having to parse the AsciiDoc first.

## Known issues

For known issues, see [GitHub](https://github.com/jboxman/asciidoc-validate-yaml/issues).
