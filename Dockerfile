FROM node:4-onbuild
RUN git clone https://github.com/SINTEF-SIT/familyMedicineReminder.git
RUN mkdir -p /usr/src/sails/
RUN cp -r familyMedicineReminder /usr/src/sails
RUN npm -g install sails
RUN cd /usr/src/sails/familyMedicineReminder; npm install
EXPOSE 1337
CMD cd /usr/src/sails/familyMedicineReminder; sails lift