import pandas as pd
import re
import json
import math

excel_file = './Moderador.xlsx'
df = pd.read_excel(excel_file)

 #   _____      _                                 
 #  / ____|    | |                                
 # | |     ___ | |_   _ _ __ ___  _ __   __ _ ___ 
 # | |    / _ \| | | | | '_ ` _ \| '_ \ / _` / __|
 # | |___| (_) | | |_| | | | | | | | | | (_| \__ \
 #  \_____\___/|_|\__,_|_| |_| |_|_| |_|\__,_|___/

PAIS_data = df["País"]
INSTITUCION_data= df["Institución"]
TIPO_data = df["Tipo"]
AREA_DESEADA_data = df["Area_Deseada"]
AREA_ALTERNATIVA_data = df["Area_Alternativa"]
ID_MOD_data = df["ID_Mod"]
MODERADOR_data = df["Moderador"]
SEXO_data = df["Sexo"]
CORREO_data = df["Correo"]
CELULAR_data = df["Celular"]
SALA_data = df["Sala"]
CORREO_ALTERNATIVO_data = df["correo alternativo"]
SALA2_data = df["sala 2"]



 #                               _           
 #     /\                       | |          
 #    /  \   _ __ _ __ ___  __ _| | ___  ___ 
 #   / /\ \ | '__| '__/ _ \/ _` | |/ _ \/ __|
 #  / ____ \| |  | | |  __/ (_| | | (_) \__ \
 # /_/    \_\_|  |_|  \___|\__, |_|\___/|___/
 #                          __/ |            
 #                         |___/             
# PAIS_data = df["País"]
# INSTITUCION_data= df["Institución"]
# TIPO_data = df["Tipo"]
# AREA_DESEADA_data = df["Area_Deseada"]
# AREA_ALTERNATIVA_data = df["Area_Alternativa"]
# ID_MOD_data = df["ID_Mod"]
# MODERADOR_data = df["Moderador"]
# SEXO_data = df["Sexo"]
# CORREO_data = df["Correo"]
# CELULAR_data = df["Celular"]
# SALA_data = df["Sala"]
# CORREO_ALTERNATIVO_data = df["correo alternativo"]
# SALA2_data = df["sala 2"]


PAIS = []
INSTITUCION = []
TIPO = []
AREA_DESEADA = []
AREA_ALTERNATIVA = []
ID_MOD = []
MODERADOR = []
SEXO = []
CORREO = []
CELULAR = []
SALA = []
CORREO_ALTERNATIVO = []
SALA2 = []

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

def limpiar_numero(celular):
    solo_digitos = re.sub(r'\D', '', str(celular))
    return solo_digitos[-10:]





# PAIS = []
# INSTITUCION = []
# TIPO = []
# AREA_DESEADA = []
# AREA_ALTERNATIVA = []
# ID_MOD = []
# MODERADOR = []
# SEXO = []
# CORREO = []
# CELULAR = []
# SALA = []
# CORREO_ALTERNATIVO = []
# SALA2 = []


def Creacion_Archivo_SQL(data_en_conjunto, n, output_file):
    fields_to_print_in_order = [
        "Pais", "Institucion","Tipo", "Area_Deseada","Area_Alternativa", "ID_Mod",
        "Moderador", "Sexo", "Correo", "Celular", "Sala", "Correo_Alternativo", "Sala2"
    ]
    sql_template = "INSERT INTO MODERADORES ({}) VALUES ({});"
    with open(output_file, "w") as file:
        for i in range(n):
            values = []

            for field in fields_to_print_in_order:
                if field in data_en_conjunto:
                    value = data_en_conjunto[field]
                    if isinstance(value, list):
                        values.append(json.dumps(value[i], ensure_ascii=False))
                    else:
                        values.append(str(value))  
            sql_statement = sql_template.format(", ".join(fields_to_print_in_order), ", ".join(values))

            file.write(sql_statement + "\n")




# PAIS = []
# INSTITUCION = []
# TIPO = []
# AREA_DESEADA = []
# AREA_ALTERNATIVA = []
# ID_MOD = []
# MODERADOR = []
# SEXO = []
# CORREO = []
# CELULAR = []
# SALA = []
# CORREO_ALTERNATIVO = []
# SALA2 = []


 #  pais
for field in PAIS_data:
    PAIS.append(field)

#  institucion
for field in INSTITUCION_data:
    INSTITUCION.append(field)

#   tipo 
for field in TIPO_data:
    TIPO.append(field)

#  area deseada y area alternativa 
for field in AREA_DESEADA_data:
    AREA_DESEADA.append(field)

for field in AREA_ALTERNATIVA_data:
    AREA_ALTERNATIVA.append(field)

# id_mod
for field in ID_MOD_data:
    if math.isnan(field):
        formatted_field = "NULL"
    else:
        formatted_field = str(int(field)).zfill(5)
    ID_MOD.append(formatted_field)
    
 #  moderador
for field in MODERADOR_data:
    MODERADOR.append(field)

 # sexo                                               
for field in SEXO_data:
    SEXO.append(field)

 #  correo
for field in CORREO_data:
    CORREO.append(field)
    
 #  celular                   
for field in CELULAR_data:
    cleaned_celular = limpiar_numero(field)
    CELULAR.append(cleaned_celular)

 #  sala                                           
for field in SALA_data:
    SALA.append(field)

  #  correo alternativo
for field in CORREO_ALTERNATIVO_data:
    CORREO_ALTERNATIVO.append(field)
    
 #  sala 2                                          
for field in SALA2_data:
    SALA2.append(field)
 #                                    _             _                          _     _            
 #     /\                            | |           | |          /\            | |   (_)           
 #    /  \   _ __ _ __ ___   __ _  __| | ___     __| | ___     /  \   _ __ ___| |__  ___   _____  
 #   / /\ \ | '__| '_ ` _ \ / _` |/ _` |/ _ \   / _` |/ _ \   / /\ \ | '__/ __| '_ \| \ \ / / _ \ 
 #  / ____ \| |  | | | | | | (_| | (_| | (_) | | (_| |  __/  / ____ \| | | (__| | | | |\ V / (_) |
 # /_/    \_\_|  |_| |_| |_|\__,_|\__,_|\___/   \__,_|\___| /_/    \_\_|  \___|_| |_|_| \_/ \___/ 
 #                                                                                                
                                                                                                

# PAIS = []
# INSTITUCION = []
# AREA_DESEADA = []
# AREA_ALTERNATIVA = []
# ID_MOD = []
# MODERADOR = []
# SEXO = []
# CORREO = []
# CELULAR = []
# SALA = []
# CORREO_ALTERNATIVO = []
# SALA2 = []

data_en_conjunto = {
        "Pais":PAIS ,
        "Institucion":INSTITUCION,
        "Tipo":TIPO,
        "Area_Deseada":AREA_DESEADA,
        "Area_Alternativa":AREA_ALTERNATIVA ,
        "ID_Mod":ID_MOD,
        "Moderador":MODERADOR,
        "Sexo":SEXO,
        "Correo":CORREO,
        "Celular":CELULAR,
        "Sala":SALA,
        "Correo_Alternativo":CORREO_ALTERNATIVO,
        "Sala2":SALA2
}


output_file = "Moderadores.sql"
Creacion_Archivo_SQL(data_en_conjunto, 77 , output_file)
