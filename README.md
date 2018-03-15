# allcalc

# Installation
`npm i allcalc -g`

# Usage

## run the calculations:
`start` calculations without any restrictions

`start -f`  filter the result of calculation according to constraints

## include element in calculations:
`in [elements name]`

for example:
`in fe al sn mg zn ni cr`

## exclude elements in calculations:
`ex [elements name]`

for example:
`ex fe al sn mg zn ni cr`

## constrain on the calcultions
### Entalpy:
`H -l'min value' -h'max value'`

for example:
`H -l'-20' -h'10'`

### Entropy
`S -l'min value' -h'max value'`

for example:
`S -l'-20' -h'10'`

### Density
`Dn -l'min value' -h'max value'`

for example:
`Dn -l'-20' -h'10'`

### Delta
`D -l'min value' -h'max value'`

for example:
`D -l'-20' -h'10'`

### Omega
`O -l'min value' -h'max value'`

for example:
`O -l'-20' -h'10'`

### Electronegativity
`E -l'min value' -h'max value'`

for example:
`E -l'-20' -h'10'`

## Number of components
for example for 5 components alloy: `nop 5`

## define allowable atomic fraction
for example: `xi 0.05 0.1 0.2 0.3`