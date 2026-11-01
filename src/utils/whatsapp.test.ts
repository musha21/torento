import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateVehicleInquiryUrl,
  generateGeneralInquiryUrl,
  formatLkrPrice,
  convertLkrToUsd,
  filterVehicles,
} from '../lib/whatsapp.ts';

test('generateVehicleInquiryUrl creates correct wa.me link with encoded text', () => {
  const url = generateVehicleInquiryUrl('Toyota Aqua');
  assert.ok(url.startsWith('https://wa.me/94777666171?text='));
  assert.ok(url.includes(encodeURIComponent('Toyota Aqua')));
  assert.ok(url.includes(encodeURIComponent('Hello TORENTO!')));
});

test('generateVehicleInquiryUrl includes custom trip details if provided', () => {
  const url = generateVehicleInquiryUrl('Honda Hornet', {
    pickupLocation: 'Bandaranaike Airport CMB',
    rentalDays: 5,
    startDate: '2026-11-15',
  });
  assert.ok(url.includes(encodeURIComponent('Bandaranaike Airport CMB')));
  assert.ok(url.includes(encodeURIComponent('5 day(s)')));
});

test('generateGeneralInquiryUrl creates default general inquiry', () => {
  const url = generateGeneralInquiryUrl();
  assert.ok(url.startsWith('https://wa.me/94777666171?text='));
  assert.ok(url.includes(encodeURIComponent('planning to visit Sri Lanka')));
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
