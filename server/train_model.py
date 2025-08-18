import pandas as pd
import numpy as np
from sklearn.metrics import  make_scorer, mean_absolute_error, mean_squared_error, r2_score
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.linear_model import LinearRegression
import joblib
import matplotlib.pyplot as plt

# Load both CSVs
df1 = pd.read_csv("student.csv")
df2 = pd.read_csv("newStudent.csv")
df3 = pd.read_csv("Student2.csv")

# Combine them
df = pd.concat([df1, df2, df3], ignore_index=True)


print("Data loaded successfully.")
print(f"Data shape: {df.shape}")
print(f"First few rows:\n{df.head()}")

# Binary mapping for yes/no, T/A, U/R
binary_map = {'yes': 1, 'no': 0, 'T': 1, 'A': 0, 'U': 1, 'R': 0, 'F': 1, 'M': 0}
df.replace(binary_map, inplace=True)

df.dropna(inplace=True)


df['parent_background'] = (
    (df['Medu'] + df['Fedu'])/2 +   
    abs(df['Mjob'].astype('category').cat.codes -
        df['Fjob'].astype('category').cat.codes)  
)

df['family_influence'] = (
    df['famsize'].astype('category').cat.codes +
    df['Pstatus'].astype('category').cat.codes +
    df['guardian'].astype('category').cat.codes
)

df['environment'] = (
    df['address'].astype('category').cat.codes / 2 +
    df['feespaid']  
)


df['academic_struggles'] = np.log1p(df['failures'] * df['absences'])

df['social_activity'] = (
    (df['Ssupport'] + df['Gsupport'])/2 +  
    (df['ecactivities'] + df['internet'])/2 +  
    df['freetime'] * df['goout']  
)

df['wellbeing'] = (df['health']/5) * (1/(df['age']+1))

df['academic_performance'] = ((df['G1'] + df['G2'])/2)

df['study_motivation'] = df['studytime'] * df['freetime']

# Final Features
X = df[[
    'parent_background',
    'family_influence',
    'environment',
    'study_motivation',
    'academic_struggles',
    'social_activity',
    'wellbeing',
    'academic_performance',
]]


# Target variable
y = df['G3']


# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)


# GridSearchCV
param_grid = {
'n_estimators': [20, 60, 100, 120],

'max_features': [0.2,0.4],

'min_samples_split': [2,4],

'max_depth': [5,15],

'max_samples': [0.5, 0.75, 1.0]
}

rf = RandomForestRegressor(n_estimators=100, random_state=42)

scoring = {'r2': 'r2',  'mae': 'neg_mean_absolute_error'}
grid_search = GridSearchCV(rf, param_grid, cv=5, scoring=scoring, refit='r2', n_jobs=-1, verbose=1)

grid_search.fit(X_train, y_train)

# Best parameters
print("Best parameters found: ", grid_search.best_params_)

# Histogram for G3
plt.figure(figsize=(6,5))
plt.hist(df['G3'], bins=15, color='orange', edgecolor='black', alpha=0.7)
plt.xlabel('Final Grade (G3)')
plt.ylabel('Frequency')
plt.title('Histogram of Final Grades (G3)')
plt.tight_layout()
plt.savefig('g3_histogram.png')
plt.close()


# Histograms for all features in X
num_features = X.shape[1]
fig, axes = plt.subplots(nrows=2, ncols=(num_features + 1) // 2, figsize=(16, 8))
axes = axes.flatten()
for i, col in enumerate(X.columns):
    axes[i].hist(X[col], bins=15, color='skyblue', edgecolor='black', alpha=0.7)
    axes[i].set_title(col)
    axes[i].set_xlabel('Value')
    axes[i].set_ylabel('Frequency')
plt.tight_layout()
plt.savefig('features_histograms.png')
plt.close()


# Evaluate model
y_pred = grid_search.predict(X_test)
l_pred = model.predict(X_test)
r2 = r2_score(y_test, y_pred)
r2l = r2_score(y_test, l_pred)
print(f"Random Forest R²: {r2}")

print(f"Linear Regression R²: {r2l}")

joblib.dump(grid_search, 'model.pkl')
joblib.dump(model, 'linear_model.pkl')
print("Model trained and saved successfully.")