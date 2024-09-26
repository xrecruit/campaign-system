import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as Papa from 'papaparse';


@Component({
  selector: 'app-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.scss']
})
export class UploadCsvComponent implements OnInit {

  dataList: any;
  uploaded: any;
  fileInvalid: boolean;
  fileName: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<any>,
  ) { }

  ngOnInit() {
  }

  onChange(files: File[]) {
    if (files[0] && files[0].name.endsWith('.csv')) {
      this.fileName = files[0].name;
      this.fileInvalid = false;
      Papa.parse(files[0], {
        header: true,
        skipEmptyLines: true,
        complete: (result, file) => {
          this.dataList = result.data;
        }
      });
    } else {
      this.fileInvalid = true;
      this.uploaded = false
    }
  }

  close() {
    this.dialogRef.close();
  }

}
