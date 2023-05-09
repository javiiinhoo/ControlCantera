O='Nombre Jugador'
N=print
J=str
A='div'
import requests as P,os,time as K,pandas as Q
from bs4 import BeautifulSoup as R
from fake_useragent import UserAgent as S
import datetime as T
U=K.time()
V=S()
W={'user-agent':V.random}
k=[]
L=[]
X=os.path.join(os.path.expanduser('~'),'Desktop/rcd','enlacestm.txt')
with open(X,'r')as Y:D=Y.readlines()
D=[A.strip()for A in D]
D=[A.replace('profil','transfers')for A in D]
def Z():C=T.datetime.now();A=C.year;B=[f"{J(A-2-B)[-2:]}/{J(A-1-B)[-2:]}"for B in range(10)];N(B);return B
a=Z()
for M in D:
	F={};G=R(P.get(M,headers=W).content,'html.parser');l=G.find(A,{'class':'box viewport-tracking'})
	try:
		H=' '.join([A.strip()if isinstance(A,J)else A.text.strip()for A in G.find('h1',class_='data-header__headline-wrapper').contents if A.name!='span'])
		if H is not None:F[O]=H.strip()
	except AttributeError:H=None
	F['Enlace TM']=M;b=G.find_all(A,class_='grid tm-player-transfer-history-grid')
	for C in b:
		I=C.find(A,class_='tm-player-transfer-history-grid__season').text.strip()
		if I in a or I=='22/23':B=F.copy();B['Temporada']=I;c=C.find(A,class_='tm-player-transfer-history-grid__date').text.strip();B['Fecha']=c;d=C.find(A,class_='tm-player-transfer-history-grid__old-club').text.strip();B['Último club']=d;e=C.find(A,class_='tm-player-transfer-history-grid__new-club').text.strip();B['Nuevo club']=e;f=C.find(A,class_='tm-player-transfer-history-grid__market-value').text.strip();B['Valor de mercado']=f.replace(',','.');g=C.find(A,class_='tm-player-transfer-history-grid__fee').text.strip();B['Coste']=g;L.append(B)
E=Q.DataFrame(L)
E=E.iloc[E[O].str.normalize('NFKD').argsort()]
E.to_csv('cantera.csv',index=False,header=True)
h=K.time()
i,j=divmod(h-U,60)
N(f"Tiempo de ejecución: {i:.0f} minuto(s) y {j:.2f} segundo(s)")