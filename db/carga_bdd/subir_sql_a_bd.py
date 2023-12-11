import mysql.connector
import os
import sys


# Verifica si se proporciona la ruta del archivo SQL como argumento de línea de comandos
if len(sys.argv) != 2:
    print("Por favor, proporciona la ruta del archivo SQL como argumento de línea de comandos.")
    sys.exit(1)

# Obtiene la ruta del archivo SQL desde los argumentos de línea de comandos
sql_file_path = sys.argv[1]

#print("Directorio de trabajo actual:", os.getcwd())

# Connection parameters
host = "localhost"
user = "root"
password = "basedatos1"
port = 3307
database = "salas_db2"

# Connect to the MySQL server
conn = mysql.connector.connect(host=host, user=user, password=password, port=port, database=database)

# Create a cursor object
cursor = conn.cursor()

# Read the .sql file
with open(sql_file_path, "r", encoding="utf8") as sql_file:
    sql_statements = sql_file.read().split(';')

# Execute each SQL statement
for sql_statement in sql_statements:
    try:
        if sql_statement.strip():
            cursor.execute(sql_statement, multi=True)
            print("SQL statement executed successfully.")

    except mysql.connector.Error as err:
        print(f"Error executing SQL statement: {err}")

# Commit changes
conn.commit()

# Close the cursor and the connection
cursor.close()
conn.close()
