/*
 * Copyright 2019 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Observable } from 'rxjs';
import { MetadataDTO, MetadataRoutesApi } from 'symbol-openapi-typescript-fetch-client';
import { Convert } from '../core/format/Convert';
import { Address } from '../model/account/Address';
import { Metadata } from '../model/metadata/Metadata';
import { MetadataEntry } from '../model/metadata/MetadataEntry';
import { MetadataType } from '../model/metadata/MetadataType';
import { MosaicId } from '../model/mosaic/MosaicId';
import { NamespaceId } from '../model/namespace/NamespaceId';
import { UInt64 } from '../model/UInt64';
import { Http } from './Http';
import { MetadataRepository } from './MetadataRepository';
import { QueryParams } from './QueryParams';

/**
 * Metadata http repository.
 *
 * @since 1.0
 */
export class MetadataHttp extends Http implements MetadataRepository {
    /**
     * @internal
     * Symbol openapi typescript-node client metadata routes api
     */
    private readonly metadataRoutesApi: MetadataRoutesApi;

    /**
     * Constructor
     * @param url Base catapult-rest url
     * @param fetchApi fetch function to be used when performing rest requests.
     */
    constructor(url: string, fetchApi?: any) {
        super(url, fetchApi);
        this.metadataRoutesApi = new MetadataRoutesApi(this.config());
    }

    /**
     * Returns the account metadata given an account id.
     * @param address - Account address to be created from PublicKey or RawAddress
     * @param queryParams - Optional query parameters
     * @returns Observable<Metadata[]>
     */
    public getAccountMetadata(address: Address, queryParams?: QueryParams): Observable<Metadata[]> {
        return this.call(
            this.metadataRoutesApi.getAccountMetadata(
                address.plain(),
                this.queryParams(queryParams).pageSize,
                this.queryParams(queryParams).ordering,
                this.queryParams(queryParams).id,
            ),
            (body) => body.metadataEntries.map((metadataEntry) => this.buildMetadata(metadataEntry)),
        );
    }

    /**
     * Returns the account metadata given an account id and a key
     * @param address - Account address to be created from PublicKey or RawAddress
     * @param key - Metadata key
     * @returns Observable<Metadata[]>
     */
    getAccountMetadataByKey(address: Address, key: string): Observable<Metadata[]> {
        return this.call(this.metadataRoutesApi.getAccountMetadataByKey(address.plain(), key), (body) =>
            body.metadataEntries.map((metadataEntry) => this.buildMetadata(metadataEntry)),
        );
    }

    /**
     * Returns the account metadata given an account id and a key
     * @param address - Account address to be created from PublicKey or RawAddress
     * @param key - Metadata key
     * @param sourceAddress - Sender address
     * @returns Observable<Metadata>
     */
    getAccountMetadataByKeyAndSender(address: Address, key: string, sourceAddress: Address): Observable<Metadata> {
        return this.call(this.metadataRoutesApi.getAccountMetadataByKeyAndSender(address.plain(), key, sourceAddress.plain()), (body) =>
            this.buildMetadata(body),
        );
    }

    /**
     * Returns the mosaic metadata given a mosaic id.
     * @param mosaicId - Mosaic identifier.
     * @param queryParams - Optional query parameters
     * @returns Observable<Metadata[]>
     */
    getMosaicMetadata(mosaicId: MosaicId, queryParams?: QueryParams): Observable<Metadata[]> {
        return this.call(
            this.metadataRoutesApi.getMosaicMetadata(
                mosaicId.toHex(),
                this.queryParams(queryParams).pageSize,
                this.queryParams(queryParams).id,
                this.queryParams(queryParams).ordering,
            ),
            (body) => body.metadataEntries.map((metadataEntry) => this.buildMetadata(metadataEntry)),
        );
    }

    /**
     * Returns the mosaic metadata given a mosaic id and metadata key.
     * @param mosaicId - Mosaic identifier.
     * @param key - Metadata key.
     * @returns Observable<Metadata[]>
     */
    getMosaicMetadataByKey(mosaicId: MosaicId, key: string): Observable<Metadata[]> {
        return this.call(this.metadataRoutesApi.getMosaicMetadataByKey(mosaicId.toHex(), key), (body) =>
            body.metadataEntries.map((metadataEntry) => this.buildMetadata(metadataEntry)),
        );
    }

    /**
     * Returns the mosaic metadata given a mosaic id and metadata key.
     * @param mosaicId - Mosaic identifier.
     * @param key - Metadata key.
     * @param sourceAddress - Sender address
     * @returns Observable<Metadata>
     */
    getMosaicMetadataByKeyAndSender(mosaicId: MosaicId, key: string, sourceAddress: Address): Observable<Metadata> {
        return this.call(
            this.metadataRoutesApi.getMosaicMetadataByKeyAndSender(mosaicId.toHex(), key, sourceAddress.plain()),
            this.buildMetadata,
        );
    }

    /**
     * Returns the mosaic metadata given a mosaic id.
     * @param namespaceId - Namespace identifier.
     * @param queryParams - Optional query parameters
     * @returns Observable<Metadata[]>
     */
    public getNamespaceMetadata(namespaceId: NamespaceId, queryParams?: QueryParams): Observable<Metadata[]> {
        return this.call(
            this.metadataRoutesApi.getNamespaceMetadata(
                namespaceId.toHex(),
                this.queryParams(queryParams).pageSize,
                this.queryParams(queryParams).id,
                this.queryParams(queryParams).ordering,
            ),
            (body) => body.metadataEntries.map(this.buildMetadata),
        );
    }

    /**
     * Returns the mosaic metadata given a mosaic id and metadata key.
     * @param namespaceId - Namespace identifier.
     * @param key - Metadata key.
     * @returns Observable<Metadata[]>
     */
    public getNamespaceMetadataByKey(namespaceId: NamespaceId, key: string): Observable<Metadata[]> {
        return this.call(this.metadataRoutesApi.getNamespaceMetadataByKey(namespaceId.toHex(), key), (body) =>
            body.metadataEntries.map(this.buildMetadata),
        );
    }

    /**
     * Returns the namespace metadata given a mosaic id and metadata key.
     * @param namespaceId - Namespace identifier.
     * @param key - Metadata key.
     * @param sourceAddress - Sender address
     * @returns Observable<Metadata>
     */
    public getNamespaceMetadataByKeyAndSender(namespaceId: NamespaceId, key: string, sourceAddress: Address): Observable<Metadata> {
        return this.call(
            this.metadataRoutesApi.getNamespaceMetadataByKeyAndSender(namespaceId.toHex(), key, sourceAddress.plain()),
            this.buildMetadata,
        );
    }

    /**
     * It maps MetadataDTO into a Metadata
     * @param metadata - the dto
     * @returns the model Metadata.
     */
    private buildMetadata(metadata: MetadataDTO): Metadata {
        const metadataEntry = metadata.metadataEntry;
        let targetId;

        switch (metadataEntry.metadataType.valueOf()) {
            case MetadataType.Mosaic:
                targetId = new MosaicId(metadataEntry.targetId as any);
                break;
            case MetadataType.Namespace:
                targetId = NamespaceId.createFromEncoded(metadataEntry.targetId as any);
                break;
            default:
                targetId = undefined;
        }
        return new Metadata(
            metadata.id,
            new MetadataEntry(
                metadataEntry.compositeHash,
                Address.createFromEncoded(metadataEntry.sourceAddress),
                Address.createFromEncoded(metadataEntry.targetAddress),
                UInt64.fromHex(metadataEntry.scopedMetadataKey),
                metadataEntry.metadataType.valueOf(),
                Convert.decodeHex(metadataEntry.value),
                targetId,
            ),
        );
    }
}
