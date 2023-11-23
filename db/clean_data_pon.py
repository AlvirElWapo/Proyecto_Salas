import re

input_file = "outputPonenciasPRB.sql"
output_file = "outputPonenciasPRB_fixed.sql"

# Abre el archivo SQL
with open(input_file, "r", encoding="utf-8") as f:
    data = f.read()

# Encuentra y reemplaza las comillas no deseadas alrededor de campos específicos
pattern = re.compile(r'("\s*[A-Za-zÁÉÍÓÚ]+[^"]*")')
data = pattern.sub(lambda x: x.group(1).replace('"', ''), data)

# Escribe el archivo SQL de salida
with open(output_file, "w", encoding="utf-8") as f:
    f.write(data)
