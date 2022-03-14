export type MimeTypeProps = string;

export type FileSizeProps = number;

export type MeasuramentUnitProps = 'KB' | 'MB' | 'GB';

export type ValidateSizeProps = {
    mimeType: MimeTypeProps;
    fileSize: FileSizeProps;
};

export interface MimeTypesWithSize {
    [key: string]: {
        size: FileSizeProps;
        measurementUnit: MeasuramentUnitProps;
    };
}
