import pandas as pd
from datetime import datetime
import re
import json

ponencias_documento = './PonenciasPRB.xlsx'
df = pd.read_excel(ponencias_documento)

 #   _____      _                                 
 #  / ____|    | |                                
 # | |     ___ | |_   _ _ __ ___  _ __   __ _ ___ 
 # | |    / _ \| | | | | '_ ` _ \| '_ \ / _` / __|
 # | |___| (_) | | |_| | | | | | | | | | (_| \__ \
 #  \_____\___/|_|\__,_|_| |_| |_|_| |_|\__,_|___/

#  /$$$$$$$                                                   /$$                    
# | $$__  $$                                                 |__/                    
# | $$  \ $$ /$$$$$$  /$$$$$$$   /$$$$$$  /$$$$$$$   /$$$$$$$ /$$  /$$$$$$   /$$$$$$$
# | $$$$$$$//$$__  $$| $$__  $$ /$$__  $$| $$__  $$ /$$_____/| $$ |____  $$ /$$_____/
# | $$____/| $$  \ $$| $$  \ $$| $$$$$$$$| $$  \ $$| $$      | $$  /$$$$$$$|  $$$$$$ 
# | $$     | $$  | $$| $$  | $$| $$_____/| $$  | $$| $$      | $$ /$$__  $$ \____  $$
# | $$     |  $$$$$$/| $$  | $$|  $$$$$$$| $$  | $$|  $$$$$$$| $$|  $$$$$$$ /$$$$$$$/
# |__/      \______/ |__/  |__/ \_______/|__/  |__/ \_______/|__/ \_______/|_______/ 
#                                                                                    
AREA_data= df["Area"]
CAMPO_data = df["Campo"]
DISCIPLINA_data = df["Disciplina"]
TITULO_data = df["Titulo"]
COMPARTIDO_data = df["Compartido"]
NO_PONENTES_data = df["NoPonentes"]
ID_PONENTES_data = df["ID_Pon(s)"]
NOMBRE_PONENTES_data = df["Ponente(s)"]
INSTITUCIONES_data = df["Institucion(es)"]


 #                               _           
 #     /\                       | |          
 #    /  \   _ __ _ __ ___  __ _| | ___  ___ 
 #   / /\ \ | '__| '__/ _ \/ _` | |/ _ \/ __|
 #  / ____ \| |  | | |  __/ (_| | | (_) \__ \
 # /_/    \_\_|  |_|  \___|\__, |_|\___/|___/
 #                          __/ |            
 #                         |___/             

#  Salas
#                                                                                    

AREA = []
CAMPO = []
DISCIPLINA = []
TITULO = []
COMPARTIDO = []
NO_PONENTES = []
ID_PONENTES = []
NOMBRE_PONENTES = []
INSTITUCIONES = []




 #  ______                _                       
 # |  ____|              (_)                      
 # | |__ _   _ _ __   ___ _  ___  _ __   ___  ___ 
 # |  __| | | | '_ \ / __| |/ _ \| '_ \ / _ \/ __|
 # | |  | |_| | | | | (__| | (_) | | | |  __/\__ \
 # |_|   \__,_|_| |_|\___|_|\___/|_| |_|\___||___/
 #                                                
 
def separar_opciones(cadena):
    parts = re.split(r',|\s{1}y\s{1}', cadena)
    result = [part.strip() for part in parts if part.strip()]
    return result

def separar_instituciones(cadena):
    return re.split(r'[,]', cadena)


import json

def Creacion_Archivo_SQL(data_en_conjunto, n, output_file):
    fields_to_print_in_order = [
        "Area", "Campo", "Disciplina", "Titulo", "Compartido", "NoPonentes", "ID_Pons", "Ponentes", "Instituciones"

    ]

    sql_template = "INSERT INTO PONENCIAS2 ({}) VALUES ({});"

    with open(output_file, "w", encoding="utf-8") as file:
        for i in range(n):
            values = []

            for field in fields_to_print_in_order:
                if field in data_en_conjunto:
                    value = data_en_conjunto[field]
                    if isinstance(value, list):
                        values.append(f"'{json.dumps(value[i], ensure_ascii=False)}'")
                    else:
                        values.append(f"'{value}'")

            sql_statement = sql_template.format(", ".join(fields_to_print_in_order), ", ".join(values))

            file.write(sql_statement)
            file.write("\n")











 #     /\                   
 #    /  \   _ __ ___  __ _ 
 #   / /\ \ | '__/ _ \/ _` |
 #  / ____ \| | |  __/ (_| |
 # /_/    \_\_|  \___|\__,_|

for field in AREA_data:
    AREA.append(field)


 # CAMPO                 
for field in CAMPO_data:
    CAMPO.append(field)

 # DISCIPLINA                 
for field in DISCIPLINA_data:
    DISCIPLINA.append(field)

 #  _______ _ _         _       
 # |__   __(_) |       | |      
 #    | |   _| |_ _   _| | ___  
 #    | |  | | __| | | | |/ _ \ 
 #    | |  | | |_| |_| | | (_) |
 #    |_|  |_|\__|\__,_|_|\___/ 
                              
for field in TITULO_data:
    TITULO.append(field)

 #   _____                                 _   _     _       
 #  / ____|                               | | (_)   | |      
 # | |     ___  _ __ ___  _ __   __ _ _ __| |_ _  __| | ___  
 # | |    / _ \| '_ ` _ \| '_ \ / _` | '__| __| |/ _` |/ _ \ 
 # | |___| (_) | | | | | | |_) | (_| | |  | |_| | (_| | (_) |
 #  \_____\___/|_| |_| |_| .__/ \__,_|_|   \__|_|\__,_|\___/ 
 #                       | |                                 
 #                       |_|                                 
 #

for field in COMPARTIDO_data:
    COMPARTIDO.append(field)

 #  _   _       _____                       _            
 # | \ | |     |  __ \                     | |           
 # |  \| | ___ | |__) |__  _ __   ___ _ __ | |_ ___  ___ 
 # | . ` |/ _ \|  ___/ _ \| '_ \ / _ \ '_ \| __/ _ \/ __|
 # | |\  | (_) | |  | (_) | | | |  __/ | | | ||  __/\__ \
 # |_| \_|\___/|_|   \___/|_| |_|\___|_| |_|\__\___||___/
                                                       

for field in NO_PONENTES_data:
    NO_PONENTES.append(field)
    
 #  _____ _____   _____             __ __  
 # |_   _|  __ \ |  __ \           / / \ \ 
 #   | | | |  | || |__) |__  _ __ | |___| |
 #   | | | |  | ||  ___/ _ \| '_ \| / __| |
 #  _| |_| |__| || |  | (_) | | | | \__ \ |
 # |_____|_____/ |_|   \___/|_| |_| |___/ |
 #           ______                \_\ /_/ 
 #          |______|                       


for column in ID_PONENTES_data:
    split_PONENTES = separar_opciones(str(column))
    ID_PONENTES.append(split_PONENTES)

 #  _____                       _        __ __  
 # |  __ \                     | |      / / \ \ 
 # | |__) |__  _ __   ___ _ __ | |_ ___| |___| |
 # |  ___/ _ \| '_ \ / _ \ '_ \| __/ _ \ / __| |
 # | |  | (_) | | | |  __/ | | | ||  __/ \__ \ |
 # |_|   \___/|_| |_|\___|_| |_|\__\___| |___/ |
 #                                      \_\ /_/ 
 #                                              

for column in NOMBRE_PONENTES_data:
    split_NOMBRES = separar_opciones(str(column))
    NOMBRE_PONENTES.append(split_NOMBRES)

 #  _____           _   _ _              _              __       __  
 # |_   _|         | | (_) |            (_)            / /       \ \ 
 #   | |  _ __  ___| |_ _| |_ _   _  ___ _  ___  _ __ | | ___  ___| |
 #   | | | '_ \/ __| __| | __| | | |/ __| |/ _ \| '_ \| |/ _ \/ __| |
 #  _| |_| | | \__ \ |_| | |_| |_| | (__| | (_) | | | | |  __/\__ \ |
 # |_____|_| |_|___/\__|_|\__|\__,_|\___|_|\___/|_| |_| |\___||___/ |
 #                                                     \_\       /_/ 



for column in INSTITUCIONES_data:
    split_INSTITUCIONES = separar_instituciones(str(column))
    INSTITUCIONES.append(split_INSTITUCIONES)




 #                                    _             _                          _     _            
 #     /\                            | |           | |          /\            | |   (_)           
 #    /  \   _ __ _ __ ___   __ _  __| | ___     __| | ___     /  \   _ __ ___| |__  ___   _____  
 #   / /\ \ | '__| '_ ` _ \ / _` |/ _` |/ _ \   / _` |/ _ \   / /\ \ | '__/ __| '_ \| \ \ / / _ \ 
 #  / ____ \| |  | | | | | | (_| | (_| | (_) | | (_| |  __/  / ____ \| | | (__| | | | |\ V / (_) |
 # /_/    \_\_|  |_| |_| |_|\__,_|\__,_|\___/   \__,_|\___| /_/    \_\_|  \___|_| |_|_| \_/ \___/ 
 #                                                                                                
                                                                                                

data_en_conjunto = {
        "Area":AREA ,
        "Campo":CAMPO ,
        "Disciplina":DISCIPLINA,
        "Titulo":TITULO ,
        "Compartido":COMPARTIDO,
        "NoPonentes":NO_PONENTES ,
        "ID_Pons":ID_PONENTES ,
        "Ponentes":NOMBRE_PONENTES ,
        "Instituciones":INSTITUCIONES ,
}


output_file = "outputPonenciasPRB.sql"
Creacion_Archivo_SQL(data_en_conjunto, 497, output_file)


