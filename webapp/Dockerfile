FROM node:22

COPY . /app
WORKDIR /app

#Install the dependencies
RUN npm install --omit=dev

ARG API_URI="http://localhost:8000"
ENV REACT_APP_API_ENDPOINT=$API_URI

# Puerto por defecto en producción
ENV PORT=80

#Create an optimized version of the webapp
RUN npm run build
RUN npm install -g serve --production

EXPOSE $PORT

#Execute npm run prod to run the server
CMD [ "npm", "run", "prod" ]
#CMD ["npm", "start"]