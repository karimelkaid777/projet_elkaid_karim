import {HttpInterceptorFn, HttpResponse} from '@angular/common/http';
import {delay, of, throwError} from 'rxjs';
import {Pollution} from '../models/pollution.model';
import {CreatePollutionDto, UpdatePollutionDto} from '../models/pollution.dto';
import {MOCK_POLLUTIONS} from '../mocks/pollution.mock';

let pollutionsDB = [...MOCK_POLLUTIONS];
let nextId = Math.max(...pollutionsDB.map(p => p.id)) + 1;

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  const { url, method, body } = req;

  const randomDelay = Math.floor(Math.random() * 300) + 200;

  if (url.includes('/api/pollution') && method === 'GET' && !url.match(/\/\d+$/)) {
    const urlObj = new URL(url, 'http://localhost');
    const type = urlObj.searchParams.get('type');
    const title = urlObj.searchParams.get('title');

    let filteredPollutions = [...pollutionsDB];

    if (type) {
      filteredPollutions = filteredPollutions.filter(p => p.type === type);
    }

    if (title) {
      filteredPollutions = filteredPollutions.filter(p =>
        p.title.toLowerCase().includes(title.toLowerCase())
      );
    }

    return of(new HttpResponse({
      status: 200,
      body: filteredPollutions
    })).pipe(delay(randomDelay));
  }

  if (url.match(/\/api\/pollution\/\d+$/) && method === 'GET') {
    const id = parseInt(url.split('/').pop()!);
    const pollution = pollutionsDB.find(p => p.id === id);

    if (pollution) {
      return of(new HttpResponse({
        status: 200,
        body: pollution
      })).pipe(delay(randomDelay));
    } else {
      return throwError(() => ({
        status: 404,
        error: { message: 'Pollution non trouvée' }
      })).pipe(delay(randomDelay));
    }
  }

  if (url.includes('/api/pollution') && method === 'POST') {
    const createDto = body as CreatePollutionDto;

    const newPollution: Pollution = {
      id: nextId++,
      title: createDto.title,
      type: createDto.type,
      description: createDto.description,
      dateObservation: createDto.dateObservation ? new Date(createDto.dateObservation) : new Date(),
      location: createDto.location,
      latitude: createDto.latitude,
      longitude: createDto.longitude,
      photoUrl: createDto.photoUrl
    };

    pollutionsDB.push(newPollution);

    return of(new HttpResponse({
      status: 201,
      body: newPollution
    })).pipe(delay(randomDelay));
  }

  if (url.match(/\/api\/pollution\/\d+$/) && method === 'PUT') {
    const id = parseInt(url.split('/').pop()!);
    const index = pollutionsDB.findIndex(p => p.id === id);

    if (index !== -1) {
      const updateDto = body as UpdatePollutionDto;

      pollutionsDB[index] = {
        ...pollutionsDB[index],
        ...(updateDto.title !== undefined && { title: updateDto.title }),
        ...(updateDto.type !== undefined && { type: updateDto.type }),
        ...(updateDto.description !== undefined && { description: updateDto.description }),
        ...(updateDto.dateObservation !== undefined && { dateObservation: new Date(updateDto.dateObservation) }),
        ...(updateDto.location !== undefined && { location: updateDto.location }),
        ...(updateDto.latitude !== undefined && { latitude: updateDto.latitude }),
        ...(updateDto.longitude !== undefined && { longitude: updateDto.longitude }),
        ...(updateDto.photoUrl !== undefined && { photoUrl: updateDto.photoUrl }),
        id
      };

      return of(new HttpResponse({
        status: 200,
        body: pollutionsDB[index]
      })).pipe(delay(randomDelay));
    } else {
      return throwError(() => ({
        status: 404,
        error: { message: 'Pollution non trouvée' }
      })).pipe(delay(randomDelay));
    }
  }

  if (url.match(/\/api\/pollution\/\d+$/) && method === 'DELETE') {
    const id = parseInt(url.split('/').pop()!);
    const index = pollutionsDB.findIndex(p => p.id === id);

    if (index !== -1) {
      pollutionsDB.splice(index, 1);

      return of(new HttpResponse({
        status: 204,
        body: null
      })).pipe(delay(randomDelay));
    } else {
      return throwError(() => ({
        status: 404,
        error: { message: 'Pollution non trouvée' }
      })).pipe(delay(randomDelay));
    }
  }

  return next(req);
};
