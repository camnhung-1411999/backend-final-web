import { Injectable, Inject } from '@nestjs/common';
import { Cloudinary } from '../utils/cloudinary.provider';
import * as fs from 'fs';
import { promisify } from 'util';
const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class CloudinaryService {
  private v2: any;
  constructor(
    @Inject(Cloudinary)
    private cloudinary,
  ) {
    this.cloudinary.v2.config({
      cloud_name: 'camnhung',
      api_key: '432754556175189',
      api_secret: '2TIXe6WJiVufXL41VhbBtYjqkgc',
    });
    this.v2 = cloudinary.v2;
  }
  async upload(file: any) {
    const infor = await this.v2.uploader.upload(file.path);
    await unlinkAsync(file.path)
    return infor;
  }
}
