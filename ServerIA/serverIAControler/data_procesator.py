import sys
import requests
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import math

# URL del endpoint de tu servidor Node.js
url = 'http://localhost:8000/ratings'

def executeIA(num_userid):
    
    # Verificar y mostrar el contenido JSON con manejo de errores
    try:
        # Solicitud, Obtener datos de los endpoints
        response = requests.get(url)

        # Verifica si hubo algún error en la solicitud
        response.raise_for_status()

        # Transforma La respuesta en Json
        ratings_json = response.json()
        # print("Ratings JSON:", ratings_json)

    except requests.exceptions.RequestException as e:
        print("Error al hacer la solicitud:", e)
    except ValueError as e:
        print("Error al convertir la respuesta de ratings a JSON:", e)
    except KeyError as e:
        print("Error al procesar los datos:", e)
    except NameError as e:
        print("Error en el nombre de la variable:", e)


    # Convertir los datos JSON a DataFrames de pandas
    # Agrupar por userId
    ratings_df = pd.json_normalize(ratings_json).groupby('userId')

    # Mostrar los DataFrames
    # print(ratings_df.head())

    
    userGroup = []
    OtherUsersGroupes = []
    
    ##########################################################################################################
    #################################### PREPARE INDIVIDUAL USER #############################################

    # Separar el grupo del usuario que pidio la recomendacion de los demas
    for user_id, group in ratings_df:

        if user_id == num_userid:
            userGroup = ratings_df.get_group(user_id) ### userGroup.append(group)
            # print(f"Usuario Separado \n {userGroup}")
        else:
            auxiliarGroup = group.drop(columns=['id'])
            OtherUsersGroupes.append(auxiliarGroup)
            # print(f"Usuario adicional {user_id}: \n {group}")

    userGroup = userGroup.drop(columns=['id']) # 'id', 'userId'
    inputRecipes = userGroup
    print(inputRecipes)
    
    ##########################################################################################################
    ######################################## PREPARE OTHER USERS #############################################

    # print(OtherUsersGroupes)
    # Tratar los datos de los demas usuarios para recomendar
    recipesPerId = pd.DataFrame()

    for group in OtherUsersGroupes:
        recipesPerId = pd.concat([recipesPerId, group], ignore_index=True)

    recipesPerId_sorted = recipesPerId.sort_values(by='recipeId')
    # print(recipesPerId_sorted)

    inputId = recipesPerId_sorted[recipesPerId_sorted['recipeId'].isin(inputRecipes['recipeId'].tolist())]
    print("otros", inputId)
    

    ##########################################################################################################
    ##################################### PROCESSING SIMILARITIES ############################################

    #Filtrar a los usuarios que han visto recetas que la entrada ha visto y almacenarlas 
    userSubset = inputId[inputId['recipeId'].isin(inputRecipes['recipeId'].tolist())]
    userSubset.head()

    print("filtradas", userSubset)
    
    # Groupby crea varios sub dataframes de datos donde todos tienen el mismo valor en la columna especificada 
    userSubsetGroup = userSubset.groupby(['userId'])
    # Ordenamos por los usuarios que han puntuado mas a las recetas en común con la entrada
    userSubsetGroup = sorted(userSubsetGroup, key=lambda x: len(x[1]), reverse=True)
    userSubsetGroup = userSubsetGroup[0:100]
    # print(userSubsetGroup)

    pearsonCorrelationDict = {}
    #Para cada grupo de usuarios de nuestro subconjunto 
    for U_Id, group in userSubsetGroup:
        #Comencemos ordenando la entrada y el grupo de usuarios actual para que los valores no se mezclen más adelante. 
        group = group.sort_values(by='recipeId')
        inputRecipes = inputRecipes.sort_values(by='recipeId')
        #Obtenga las puntuaciones de las reseñas de las recetas que ambos tienen en común 
        temp_df = inputRecipes[inputRecipes['recipeId'].isin(group['recipeId'].tolist())]

        #Y luego guárdelos en una variable de búfer temporal en un formato de lista para facilitar cálculos futuros 
        tempRatingList = temp_df['score'].tolist()
        #Pongamos también las reseñas del grupo de usuarios actual en un formato de lista 
        tempGroupList = group['score'].tolist()

        # print(tempRatingList)
        # print(tempGroupList)

        data_corr = {'tempGroupList': tempGroupList, 'tempRatingList': tempRatingList}
        print("data_corr", data_corr)
        pd_corr = pd.DataFrame(data_corr)
        r = pd_corr.corr(method="pearson")["tempRatingList"]["tempGroupList"]
        # #ahora eliminamos los nan de nuestro coef de pearson
        if math.isnan(r) == True:
            r = 0
        pearsonCorrelationDict[U_Id] = r

    
    #Convertimos el diccionario a un dataframe:         
    pearsonDF = pd.DataFrame.from_dict(pearsonCorrelationDict, orient='index')
    pearsonDF.columns = ['similarityIndex']
    pearsonDF['userId'] = pearsonDF.index
    pearsonDF.index = range(len(pearsonDF))
    pearsonDF.head()
    print("person", pearsonDF)

    #Ahora veamos los 50 usuarios principales que son más similares a la entrada
    topUsers=pearsonDF.sort_values(by='similarityIndex', ascending=False)[0:50]
    topUsers.head()

    #Clasificación de usuarios seleccionados para todas las recetas tomando el promedio ponderado de las calificaciones 
    user_avg_rating = ratings_df['score'].mean()

    print("prom",user_avg_rating[1])



    topUsersRating=topUsers.merge(user_avg_rating, left_on='userId', right_on='userId', how='inner')
    topUsersRating.head()
    print(topUsersRating)

    # topUsersRating['weightedRating'] = topUsersRating['similarityIndex']*topUsersRating['rating']
    # topUsersRating.head()
    

    return True



if __name__ == '__main__':
    # num = int(sys.argv[1])  # Takes number from command line argument
    num = 2
    executeIA(num)
    sys.stdout.flush()