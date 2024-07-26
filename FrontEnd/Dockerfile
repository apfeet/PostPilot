FROM node:16


WORKDIR /app


COPY ./PostPilot-frontEND/package.json ./
COPY ./PostPilot-frontEND/package-lock.json ./  


RUN npm install


COPY ./PostPilot-frontEND/ .



CMD ["npm", "run", "dev"]
