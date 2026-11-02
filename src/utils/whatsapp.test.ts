import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateVehicleInquiryUrl,
  generateGeneralInquiryUrl,
  generateFleetInquiryUrl,
  formatLkrPrice,
  convertLkrToUsd,
  filterVehicles,
  formatInquiryDateRange,
  GENERAL_INQUIRY_MESSAGE,
} from '../lib/whatsapp.ts';

test('generateVehicleInquiryUrl creates correct wa.me link with encoded text', () => {
  const url = generateVehicleInquiryUrl('Toyota Aqua');
  assert.ok(url.startsWith('https://wa.me/94777666171?text='));
  assert.ok(url.includes(encodeURIComponent('Toyota Aqua')));
  assert.ok(url.includes(encodeURIComponent('Hello TORENTO team!')));
  assert.ok(url.includes(encodeURIComponent('confirm availability')));
});

test('generateVehicleInquiryUrl includes dates, location, price and type', () => {
  const url = generateVehicleInquiryUrl('Honda Dio', {
    vehicleType: 'scooter',
    pickupLocation: 'Colombo',
    startDate: '2026-11-10',
    endDate: '2026-11-12',
    pricePerDay: 4500,
  });
  assert.ok(url.includes(encodeURIComponent('Honda Dio scooter')));
  assert.ok(url.includes(encodeURIComponent('Colombo')));
  assert.ok(url.includes(encodeURIComponent('10 Nov – 12 Nov')));
  assert.ok(url.includes(encodeURIComponent('LKR 4,500/day')));
});

test('formatInquiryDateRange formats ISO dates', () => {
  assert.equal(formatInquiryDateRange('2026-11-10', '2026-11-12'), '10 Nov – 12 Nov');
});

test('generateGeneralInquiryUrl creates default general inquiry', () => {
  const url = generateGeneralInquiryUrl();
  assert.ok(url.startsWith('https://wa.me/94777666171?text='));
  assert.ok(url.includes(encodeURIComponent('car and bike rental services')));
  assert.equal(
    decodeURIComponent(url.split('text=')[1] || ''),
    GENERAL_INQUIRY_MESSAGE
  );
});

test('generateFleetInquiryUrl encodes cars and bikes asks', () => {
  const cars = generateFleetInquiryUrl('cars');
  const bikes = generateFleetInquiryUrl('bikes');
  assert.ok(cars.includes(encodeURIComponent('available cars')));
  assert.ok(bikes.includes(encodeURIComponent('available bikes')));
});

test('formatLkrPrice formats number properly with comma', () => {
  assert.equal(formatLkrPrice(8500), 'LKR 8,500');
  assert.equal(formatLkrPrice(12000), 'LKR 12,000');
});

test('convertLkrToUsd calculates correct approximation', () => {
  assert.equal(convertLkrToUsd(9000, 300), '~$30 USD');
  assert.equal(convertLkrToUsd(3000, 300), '~$10 USD');
});

test('filterVehicles filters by category correctly', () => {
  const mockVehicles = [
    { name: 'Toyota Aqua', category: 'cars' },
    { name: 'Honda Dio', category: 'bikes' },
    { name: 'Toyota Premio', category: 'premium' },
  ];

  const all = filterVehicles(mockVehicles, 'all');
  assert.equal(all.length, 3);

  const bikes = filterVehicles(mockVehicles, 'bikes');
  assert.equal(bikes.length, 1);
  assert.equal(bikes[0].name, 'Honda Dio');

  const cars = filterVehicles(mockVehicles, 'cars');
  assert.equal(cars.length, 1);
  assert.equal(cars[0].name, 'Toyota Aqua');
});
